"use client";

import { Card } from "@/components/ui/card";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import { ORDER_STATUS } from "@/src/consts/order.const";
import { TMeta } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

interface IProps {
  ordersResult: {
    data: TOrder[];
    meta?: TMeta;
  };
}

type PickedStatus = Pick<typeof ORDER_STATUS, "READY_FOR_PICKUP">;

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const CARD_BG = "#FFFFFF";

const sortOptions = [
  { label: "Newest First", value: "-createdAt" },
  { label: "Oldest First", value: "createdAt" },
];

/* Format price */
const formatPrice = (n: number) => `${n.toFixed(2)}€`;

/* ---------------------- Page Component ---------------------- */
export default function ReadyForPickupOrders({ ordersResult }: IProps) {
  return (
    <div style={{ background: BG }} className="min-h-screen p-6 md:p-10">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Vendor — Ready for pickup
            </h1>
          </div>
        </div>

        <AllFilters sortOptions={sortOptions} />

        {/* Orders list — ONE CARD PER ROW (full width) */}
        <div className="space-y-4">
          <AnimatePresence>
            {ordersResult?.data?.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-gray-500"
              >
                No orders match your query.
              </motion.div>
            )}
            {ordersResult?.data?.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
              >
                <Card
                  className={`p-4 rounded-2xl shadow-md border ${
                    order.flash ? "ring-4 ring-[rgba(220,49,115,0.14)]" : ""
                  }`}
                  style={{ background: CARD_BG }}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left column: avatar + details */}
                    <div className="flex gap-4 items-start min-w-0">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-bold"
                        style={{ background: `${PRIMARY}1A`, color: PRIMARY }}
                      >
                        {order.customerId?.name?.firstName?.charAt(0)}
                        {order.customerId?.name?.lastName?.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg truncate">
                            {order.customerId?.name?.firstName}{" "}
                            {order.customerId?.name?.lastName}
                          </h3>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />{" "}
                            {format(order.updatedAt, "HH:mm")}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-2 truncate">
                          {order.items?.map((item, i) => (
                            <span key={i}>
                              {item.quantity}x {item.productId?.name}
                              {order.items?.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </p>

                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-2 truncate">
                          <MapPin size={12} /> {order.pickupAddress?.street},{" "}
                          {order.pickupAddress?.postalCode},{" "}
                          {order.pickupAddress?.city},{" "}
                          {order.pickupAddress?.state},{" "}
                          {order.pickupAddress?.country}
                        </p>
                      </div>
                    </div>

                    {/* Right column: price + actions */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-lg font-bold">
                        {formatPrice(order.totalPrice)}
                      </div>
                      {/* status + actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <StatusPill
                          status={order.orderStatus as keyof PickedStatus}
                          small
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {!!ordersResult?.meta?.total && ordersResult?.meta?.total > 0 && (
          <div className="px-6 pb-4">
            <PaginationComponent
              totalPages={ordersResult?.meta?.totalPage || 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* Status pill */
function StatusPill({
  status,
  small,
}: {
  status: keyof PickedStatus;
  small?: boolean;
}) {
  const map: Record<
    keyof PickedStatus,
    { label: string; bg: string; color: string }
  > = {
    READY_FOR_PICKUP: { label: "READY", bg: "#FFE1EC", color: PRIMARY },
  };

  const s = map[status];
  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
        small ? "text-sm" : ""
      }`}
      style={{ background: s.bg, color: s.color }}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
      {s.label}
    </div>
  );
}
