"use client";

import PayoutTable from "@/src/components/Dashboard/Payments/Payouts/PayoutTable";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TPayout } from "@/src/types/payout.type";
import { motion } from "framer-motion";

interface IProps {
  payoutsResult: { data: TPayout[]; meta?: TMeta };
}

export default function Payouts({ payoutsResult }: IProps) {
  const { t } = useTranslation();
  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full">
      {/* Page Title */}
      <TitleHeader
        title={t("vendor_payouts")}
        subtitle={t("earnings_balance_payout")}
      />

      {/* Filters */}
      <AllFilters sortOptions={sortOptions} />

      {/* Payout Table */}
      <PayoutTable payouts={payoutsResult?.data || []} />

      {/* Pagination */}
      {!!payoutsResult?.meta?.totalPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 md:px-6"
        >
          <PaginationComponent
            totalPages={payoutsResult?.meta?.totalPage as number}
          />
        </motion.div>
      )}
    </div>
  );
}
