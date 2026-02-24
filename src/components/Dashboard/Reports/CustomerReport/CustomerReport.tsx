"use client";

import AnalyticsChart from "@/src/components/AnalyticsChart/AnalyticsChart";
import CustomerReportTable from "@/src/components/Dashboard/Reports/CustomerReport/CustomerReportTable";
import ExportPopover from "@/src/components/ExportPopover/ExportPopover";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import StatsCard from "@/src/components/StatsCard/StatsCard";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { TMeta } from "@/src/types";
import { TCustomer } from "@/src/types/customer.type";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { EuroIcon, ShoppingBag, User } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface IProps {
  customersData: { data: TCustomer[]; meta?: TMeta };
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

const monthlyCustomers = [
  {
    name: "Jan",
    customers: 45,
  },
  {
    name: "Feb",
    customers: 62,
  },
  {
    name: "Mar",
    customers: 58,
  },
  {
    name: "Apr",
    customers: 71,
  },
  {
    name: "May",
    customers: 89,
  },
  {
    name: "Jun",
    customers: 95,
  },
];

export default function CustomerReport({ customersData }: IProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `customer_report_${format(new Date(), "yyyy-MM-dd_hh_mm_ss_a")}`,
  });

  const stats = {
    total: customersData.meta?.total || 0,
    highestSpender: "John Doe",
    mostOrders: "Jane Smith",
  };

  return (
    <div
      ref={reportRef}
      className="print-container min-h-screen bg-gray-50/50 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 print:pt-4">
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
          title="Customer Report"
          subtitle="Overview of all registered customers and their activity"
          extraComponent={
            <ExportPopover
              onPDFClick={() => handlePrint()}
              // onCSVClick={() =>
              //   exportCustomerReportCSV({
              //     stats: stats,
              //     monthlyCustomers,
              //     customers: customersData.data,
              //   })
              // }
            />
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print:mb-4">
          <StatsCard
            title="Total Customers"
            value={stats.total}
            icon={User}
            delay={0}
          />
          <StatsCard
            title="Highest Spender"
            value={stats.highestSpender}
            icon={EuroIcon}
            delay={0.1}
          />
          <StatsCard
            title="Most Orders"
            value={stats.mostOrders}
            icon={ShoppingBag}
            delay={0.2}
          />
        </div>

        {/* Charts */}
        <div className="mb-8 print:mb-4">
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
              Customer Growth
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Customer ordered over the last 6 months
            </p>
            <AnalyticsChart
              data={monthlyCustomers}
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
                <h2 className="text-lg font-bold text-gray-900">
                  All Customers
                </h2>
                <p className="text-sm text-gray-500">
                  {customersData.meta?.total || 0} customers
                </p>
              </div>
            </div>
          </div>

          <AllFilters sortOptions={sortOptions} filterOptions={filterOptions} />

          <CustomerReportTable customers={customersData?.data} />

          {!!customersData?.meta?.totalPage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PaginationComponent
                totalPages={customersData?.meta?.totalPage as number}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
