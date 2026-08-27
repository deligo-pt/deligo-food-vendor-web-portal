"use client";

import OrderTable from "@/src/components/Dashboard/Orders/OrderTable";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { ORDER_STATUS } from "@/src/consts/order.const";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { motion } from "framer-motion";
import { useState } from "react";

interface IProps {
  ordersResult: { data: TOrder[]; meta?: TMeta };
  showFilters?: boolean;
  title: string;
  subtitle?: string;
}

export default function Orders({
  ordersResult,
  title,
  subtitle,
  showFilters = false,
}: IProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<TOrder | null>(null);
  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  const filterOptions = [
    {
      label: t("order_status"),
      key: "orderStatus",
      placeholder: "Select Status",
      type: "select",
      items: [
        {
          label: t("all"),
          value: "all",
        },
        {
          label: t("pending"),
          value: ORDER_STATUS.PENDING,
        },
        {
          label: t("accepted"),
          value: ORDER_STATUS.ACCEPTED,
        },
        {
          label: t("rejected"),
          value: ORDER_STATUS.REJECTED,
        },
        {
          label: t("cancelled"),
          value: ORDER_STATUS.CANCELED,
        },
        {
          label: t("dispatching"),
          value: ORDER_STATUS.DISPATCHING,
        },
        {
          label: t("awaiting_partner"),
          value: ORDER_STATUS.AWAITING_PARTNER,
        },
        {
          label: t("assigned"),
          value: ORDER_STATUS.ASSIGNED,
        },
        {
          label: t("reassignment_needed"),
          value: ORDER_STATUS.REASSIGNMENT_NEEDED,
        },
        {
          label: t("preparing"),
          value: ORDER_STATUS.PREPARING,
        },
        {
          label: t("ready_for_pickup"),
          value: ORDER_STATUS.READY_FOR_PICKUP,
        },
        {
          label: t("on_the_way"),
          value: ORDER_STATUS.ON_THE_WAY,
        },
        {
          label: t("delivered"),
          value: ORDER_STATUS.DELIVERED,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Title */}
      <TitleHeader title={t(`${title}`)} subtitle={t(`${subtitle}`)} />

      {/* Filters */}
      <AllFilters
        sortOptions={sortOptions}
        {...(showFilters && { filterOptions })}
      />

      {/* Order Table */}
      <OrderTable
        orders={ordersResult?.data || []}
      // viewOrder={(order) => setSelected(order)}
      />

      {/* Pagination */}
      {!!ordersResult?.meta?.totalPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 md:px-6"
        >
          <PaginationComponent
            totalPages={ordersResult?.meta?.totalPage as number}
          />
        </motion.div>
      )}

      {/* Order details sheet */}
      {/* <OrderDetailsSheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        selectedOrder={selected}
      /> */}
    </div>
  );
}
