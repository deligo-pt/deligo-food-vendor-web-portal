"use client";

import TransactionTable from "@/src/components/Dashboard/Payments/Transactions/TransactionTable";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TTransaction } from "@/src/types/transaction.type";
import { motion } from "framer-motion";

interface IProps {
  transactionsResult: { data: TTransaction[]; meta?: TMeta };
}

export default function Transactions({ transactionsResult }: IProps) {
  const { t } = useTranslation();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  return (
    <div className="space-y-6 max-w-full">
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

      {/* Page Title */}
      <div className="print:hidden">
        <TitleHeader
          title={t("transaction_history")}
          subtitle={t("full_breakdown_of_earnings_payouts_fees")}
        />
      </div>

      {/* Filters */}
      <div className="print:hidden">
        <AllFilters sortOptions={sortOptions} />
      </div>

      {/* Transaction Table */}
      <TransactionTable transactions={transactionsResult?.data || []} />

      {/* Pagination */}
      <div className="print:hidden">
        {!!transactionsResult?.meta?.totalPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 md:px-6"
          >
            <PaginationComponent
              totalPages={transactionsResult?.meta?.totalPage as number}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
