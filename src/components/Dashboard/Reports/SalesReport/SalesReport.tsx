"use client";

import AnalyticsChart from "@/src/components/AnalyticsChart/AnalyticsChart";
import SalesReportOrderTable from "@/src/components/Dashboard/Reports/SalesReport/SalesReportOrderTable";
import ExportPopover from "@/src/components/ExportPopover/ExportPopover";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import StatsCard from "@/src/components/StatsCard/StatsCard";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { ORDER_STATUS } from "@/src/consts/order.const";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CreditCard, Filter, ShoppingBag, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const salesData = [
  {
    name: "Mon",
    sales: 450,
    orders: 12,
  },
  {
    name: "Tue",
    sales: 520,
    orders: 15,
  },
  {
    name: "Wed",
    sales: 480,
    orders: 14,
  },
  {
    name: "Thu",
    sales: 610,
    orders: 18,
  },
  {
    name: "Fri",
    sales: 850,
    orders: 25,
  },
  {
    name: "Sat",
    sales: 920,
    orders: 28,
  },
  {
    name: "Sun",
    sales: 780,
    orders: 22,
  },
];
interface IProps {
  ordersResult: { data: TOrder[]; meta?: TMeta };
}

export default function SalesReport({ ordersResult }: IProps) {
  const { t } = useTranslation();
  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `sales_report_${format(new Date(), "yyyy-MM-dd_hh_mm_ss_a")}`,
  });

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  const filterOptions = [
    {
      label: "Order Status",
      key: "orderStatus",
      placeholder: "Select Status",
      type: "select",
      items: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Pending",
          value: ORDER_STATUS.PENDING,
        },
        {
          label: "Accepted",
          value: ORDER_STATUS.ACCEPTED,
        },
        {
          label: "Rejected",
          value: ORDER_STATUS.REJECTED,
        },
        {
          label: "Canceled",
          value: ORDER_STATUS.CANCELED,
        },
        {
          label: "Dispatching",
          value: ORDER_STATUS.DISPATCHING,
        },
        {
          label: "Waiting for Partner",
          value: ORDER_STATUS.AWAITING_PARTNER,
        },
        {
          label: "Assigned to Partner",
          value: ORDER_STATUS.ASSIGNED,
        },
        {
          label: "Reassignment Needed",
          value: ORDER_STATUS.REASSIGNMENT_NEEDED,
        },
        {
          label: "Preparing",
          value: ORDER_STATUS.PREPARING,
        },
        {
          label: "Ready for Pickup",
          value: ORDER_STATUS.READY_FOR_PICKUP,
        },
        {
          label: "On the Way",
          value: ORDER_STATUS.ON_THE_WAY,
        },
        {
          label: "Delivered",
          value: ORDER_STATUS.DELIVERED,
        },
      ],
    },
  ];

  return (
    <div ref={reportRef} className="print-container min-h-screen p-6">
      {/* Logo for print */}
      <div className="hidden print:flex items-center gap-2 mb-4">
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#DC3173] overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/deligoLogo.png"
            alt="DeliGo Logo"
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
        <h1 className="font-bold text-xl text-[#DC3173]">DeliGo</h1>
      </div>
      {/* Header */}
      <TitleHeader
        title={t("sales_report")}
        subtitle={t("detailed_revenue_performance")}
        extraComponent={
          <ExportPopover
            onPDFClick={() => handlePrint()}
            //   onCSVClick={() =>
            //     exportCustomerReportCSV({
            //       stats: stats,
            //       monthlySignups,
            //       statusDistribution,
            //       customers: customersData.data,
            //     })
            //   }
          />
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Sales"
          value="€4,610.00"
          icon={CreditCard}
          delay={0}
        />
        <StatsCard
          title="Total Orders"
          value="134"
          icon={ShoppingBag}
          delay={0.1}
        />
        <StatsCard
          title="Avg Order Value"
          value="€34.40"
          icon={TrendingUp}
          delay={0.2}
        />
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.3,
        }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Sales Overview</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#DC3173]/10 rounded-lg text-xs font-medium text-[#DC3173]">
              <div className="w-2 h-2 rounded-full bg-[#DC3173]" />
              Sales (€)
            </div>
          </div>
        </div>
        <AnalyticsChart
          data={salesData}
          type="bar"
          dataKey="sales"
          height={300}
        />
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.4,
        }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <button className="p-2 text-gray-400 hover:text-[#DC3173] hover:bg-[#DC3173]/10 rounded-lg transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <AllFilters sortOptions={sortOptions} filterOptions={filterOptions} />

        <SalesReportOrderTable orders={ordersResult?.data} />

        {!!ordersResult?.meta?.totalPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PaginationComponent
              totalPages={ordersResult?.meta?.totalPage as number}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
