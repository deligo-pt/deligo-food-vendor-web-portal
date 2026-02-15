"use client";

import OrderDetailsSheet from "@/src/components/Dashboard/Orders/OrderDetailsSheet";
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
    <div className="p-4 md:p-6 space-y-6 max-w-full">
      {/* Page Title */}
      <TitleHeader title={title} subtitle={subtitle} />

      {/* Filters */}
      <AllFilters
        sortOptions={sortOptions}
        {...(showFilters && { filterOptions })}
      />

      {/* Order Table */}
      <OrderTable
        orders={ordersResult?.data || []}
        viewOrder={(order) => setSelected(order)}
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
      <OrderDetailsSheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        selectedOrder={selected}
      />
    </div>
  );
}
