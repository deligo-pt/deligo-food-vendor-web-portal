import { TSalesReport } from "@/src/types/report.type";
import { format } from "date-fns";

export function generateSalesReportCSV(data: TSalesReport) {
  const rows: (string | number)[][] = [];

  /* ===== SECTION 1: SUMMARY ===== */
  rows.push(["--- SALES SUMMARY ---"]);
  rows.push(["Total Sales(€)", data.stats.totalSales]);
  rows.push(["Total Orders", data.stats.totalOrders]);
  rows.push(["Average Order Value(€)", data.stats.avgOrderValue]);

  rows.push([]);

  /* ===== SECTION 2: SALES OVERVIEW ===== */
  rows.push(["--- SALES OVERVIEW (LAST 7 DAYS) ---"]);
  rows.push(["Day", "Sales(€)"]);

  data.salesData?.forEach((item) => {
    rows.push([item.name, item.sales]);
  });

  rows.push([]);

  // ===== SECTION 3: ORDERS TABLE =====
  rows.push(["--- RECENT ORDERS ---"]);
  rows.push([
    "Order ID",
    "Customer Name",
    "Customer Phone",
    "Items",
    "Amount(€)",
    "Date",
    "Status",
  ]);

  data.orders?.map((order) => {
    rows.push([
      order.orderId,
      `${order.customerId.name?.firstName} ${order.customerId.name?.lastName}`.trim() ||
        "-",
      order.customerId.contactNumber || "-",
      order.items
        .map(
          (item) => `${item.productId?.name} (x${item.itemSummary?.quantity})`,
        )
        .join(", "),
      (order?.payoutSummary?.vendor?.vendorNetPayout || 0) +
        (order?.payoutSummary?.deliGoCommission?.totalDeduction || 0),
      format(new Date(order.createdAt), "yyyy-MM-dd"),
      order.orderStatus,
    ]);
  });

  /* ===== BUILD CSV ===== */
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `sales_report_${format(
    new Date(),
    "yyyy-MM-dd_hh_mm_ss_a",
  )}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}
