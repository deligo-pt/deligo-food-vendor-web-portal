import { TCustomerReport } from "@/src/types/report.type";
import { format } from "date-fns";

export function generateCustomerReportCSV({
  monthlyCustomers,
  stats,
  customers,
}: TCustomerReport) {
  const rows: (string | number | undefined | null)[][] = [];

  // ===== SECTION 1: SUMMARY STATS =====
  rows.push(["--- SUMMARY STATS ---"]);
  rows.push(["Total Customers", String(stats.totalCustomers)]);
  rows.push(["Highest Spender", String(stats.highestSpender)]);
  rows.push(["Most Orders", String(stats.mostOrders)]);
  rows.push([]); // spacer row

  // ===== SECTION 2: MONTHLY SIGNUPS =====
  rows.push(["--- CUSTOMER ORDERS (LAST 6 MONTHS) ---"]);
  rows.push(["Month", "Customers"]);
  monthlyCustomers.forEach((item) => {
    rows.push([item.name, String(item.customers)]);
  });
  rows.push([]);

  // ===== SECTION 3: CUSTOMERS TABLE =====
  rows.push(["--- CUSTOMERS ---"]);
  rows.push([
    "Name",
    "Contact No",
    "Orders",
    "Total Spent(€)",
    "Last Ordered Date",
  ]);

  customers?.data?.forEach((c) => {
    rows.push([
      c.name?.firstName && c.name?.lastName
        ? `${c.name?.firstName} ${c.name?.lastName}`
        : "N/A",
      c.contactNumber || "N/A",
      c.orders?.totalOrders || 0,
      c.orders?.totalSpent || 0,
      c.orders?.lastOrderDate
        ? format(c.orders?.lastOrderDate, "yyyy-MM-dd")
        : "N/A",
    ]);
  });

  // ===== BUILD CSV =====
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `customer_report_${format(new Date(), "yyyy-MM-dd_hh_mm_ss_a")}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}
