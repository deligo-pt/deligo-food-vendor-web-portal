"use client";

import AnalyticsChart from "@/src/components/AnalyticsChart/AnalyticsChart";
import CustomerReportTable from "@/src/components/Dashboard/Reports/CustomerReport/CustomerReportTable";
import ExportPopover from "@/src/components/ExportPopover/ExportPopover";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import StatsCard from "@/src/components/StatsCard/StatsCard";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TCustomerReport } from "@/src/types/report.type";
import { generateCustomerReportCSV } from "@/src/utils/csv/generateCustomerReportCSV";
import { generateCustomerReportPDF } from "@/src/utils/pdf/customerReportPdf";
import { motion } from "framer-motion";
import { EuroIcon, ShoppingBag, User } from "lucide-react";

interface IProps {
  customerReportData: { data: TCustomerReport; meta?: TMeta };
}

const sortOptions = [
  { label: "Newest First", value: "-createdAt" },
  { label: "Oldest First", value: "createdAt" },
  { label: "Name (A-Z)", value: "name.firstName" },
  { label: "Name (Z-A)", value: "-name.lastName" },
];

const filterOptions = [
  {
    label: "Status",
    key: "status",
    placeholder: "Select Status",
    type: "select",
    items: [
      {
        label: "Pending",
        value: "PENDING",
      },
      {
        label: "Approved",
        value: "APPROVED",
      },
      {
        label: "Blocked",
        value: "BLOCKED",
      },
    ],
  },
];

export default function CustomerReport({ customerReportData }: IProps) {
  const { t } = useTranslation();

  const stats = {
    total: customerReportData?.data?.stats?.totalCustomers || 0,
    highestSpender: customerReportData?.data?.stats?.highestSpender || "N/A",
    mostOrders: customerReportData?.data?.stats?.mostOrders || "N/A",
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <TitleHeader
        title={t("customer_report")}
        subtitle={t("overview_of_all_registered_customers")}
        extraComponent={
          <ExportPopover
            onPDFClick={() =>
              generateCustomerReportPDF(customerReportData?.data)
            }
            onCSVClick={() =>
              generateCustomerReportCSV(customerReportData?.data)
            }
          />
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title={t("total_customers")}
          value={stats.total}
          icon={User}
          delay={0}
        />
        <StatsCard
          title={t("highest_spender")}
          value={stats.highestSpender}
          icon={EuroIcon}
          delay={0.1}
        />
        <StatsCard
          title={t("most_orders")}
          value={stats.mostOrders}
          icon={ShoppingBag}
          delay={0.2}
        />
      </div>

      {/* Charts */}
      <div className="mb-8">
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
            delay: 0.2,
          }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {t("customer_growth")}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {t("customer_ordered_over_last_6_months")}
          </p>
          <AnalyticsChart
            data={customerReportData?.data?.monthlyCustomers || []}
            type="bar"
            dataKey="customers"
            height={200}
          />
        </motion.div>
      </div>

      {/* Table */}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#DC3173]/10 rounded-lg text-[#DC3173]">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t("all_customers")}</h2>
              <p className="text-sm text-gray-500">
                {customerReportData?.data?.customers?.meta?.total || 0}{" "}
                {t("customers")}
              </p>
            </div>
          </div>
        </div>

        <AllFilters sortOptions={sortOptions} filterOptions={filterOptions} />

        <CustomerReportTable
          customers={customerReportData?.data?.customers?.data || []}
          t={t}
        />

        {!!customerReportData?.data?.customers?.meta?.totalPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PaginationComponent
              totalPages={
                customerReportData?.data?.customers?.meta?.totalPage as number
              }
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
