import { TSalesReport } from "@/src/types/report.type";
import { formatPrice } from "@/src/utils/formatPrice";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateSalesReportPDF = (sales: TSalesReport) => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 15;

  // header section
  const headerTop = 15;
  const logoSize = 18;

  doc.addImage(
    "/deligoLogo.png",
    "PNG",
    marginX,
    headerTop,
    logoSize,
    logoSize,
  );

  const textX = marginX + logoSize + 6;
  let currentY = headerTop + 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PIXELMIRACLE, LDA", textX, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  currentY += 5;
  doc.text("Avenida do Brasil, nº 43, 6º D", textX, currentY);

  currentY += 4;
  doc.text("1700-062 Lisboa, Portugal", textX, currentY);

  currentY += 4;
  doc.text("NIF: 518758176", textX, currentY);

  currentY += 4;
  doc.text("Email: contact@deligo.pt", textX, currentY);

  currentY += 4;
  doc.setTextColor(220, 49, 115);
  doc.text("www.deligo.pt", textX, currentY);
  doc.setTextColor(0);

  // Right header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Vendor Sales Report", pageWidth - marginX, headerTop + 5, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Generated: ${format(new Date(), "yyyy-MM-dd")}`,
    pageWidth - marginX,
    headerTop + 11,
    { align: "right" },
  );

  // Divider
  const dividerY = Math.max(headerTop + logoSize, currentY) + 8;
  doc.setDrawColor(220, 49, 115);
  doc.line(marginX, dividerY, pageWidth - marginX, dividerY);

  // summary
  let y = dividerY + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Sales Summary", marginX, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Total Sales: €${sales.stats.totalSales}`, marginX, y);
  y += 5;
  doc.text(`Total Orders: ${sales.stats.totalOrders}`, marginX, y);
  y += 5;
  doc.text(`Average Order Value: €${sales.stats.avgOrderValue}`, marginX, y);

  // earnings by day
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Sales Overview (Last 7 days)", marginX, y);

  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Day", ...sales.salesData.map((d) => d.name)]],
    body: [
      ["Sales (€)", ...sales.salesData.map((d) => formatPrice(d.sales || 0))],
    ],
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [220, 49, 115],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: marginX, right: marginX },
  });

  y += 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Recent Orders", marginX, y);

  y += 4;

  autoTable(doc, {
    startY: y,
    head: [
      [
        "Order ID",
        "Customer Name",
        "Customer Phone",
        "Items",
        "Amount",
        "Date",
        "Status",
      ],
    ],
    body:
      sales.orders?.map((order) => [
        order.orderId,
        `${order.customerId.name?.firstName} ${order.customerId.name?.lastName}`.trim() ||
          "-",
        order.customerId.contactNumber || "-",
        order.items
          .map(
            (item) =>
              `${item.productId?.name} (x${item.itemSummary?.quantity})`,
          )
          .join(", "),
        `€${formatPrice(
          (order?.payoutSummary?.vendor?.vendorNetPayout || 0) +
            (order?.payoutSummary?.deliGoCommission?.totalDeduction || 0),
        )}`,
        format(new Date(order.createdAt), "yyyy-MM-dd"),
        order.orderStatus,
      ]) || [],
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [220, 49, 115],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    bodyStyles: {
      fillColor: [235, 235, 235],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: marginX, right: marginX },
  });

  // footer section
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, {
      align: "center",
    });
  }

  doc.save(`sales_report_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.pdf`);
};
