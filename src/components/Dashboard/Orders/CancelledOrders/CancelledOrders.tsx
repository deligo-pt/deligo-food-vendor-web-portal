"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import { TMeta } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { format } from "date-fns";
import { Clock, MapPin, XCircle } from "lucide-react";

interface IProps {
  ordersResult: {
    data: TOrder[];
    meta?: TMeta;
  };
}

const PRIMARY = "#DC3173";
const BG = "#FFF3F7";
// const CARD_BG = "#FFFFFF";
const SHADOW = "0px 4px 24px rgba(0,0,0,0.07)";

/* -----------------------------------------
   Reason Labels (premium style)
------------------------------------------ */
// const REASON_LABEL: Record<
//   CancelledOrder["reason"],
//   { text: string; color: string }
// > = {
//   customer_cancelled: { text: "Customer Cancelled", color: "#EA580C" },
//   restaurant_cancelled: { text: "Restaurant Cancelled", color: PRIMARY },
//   delivery_failed: { text: "Delivery Failed", color: "#DC2626" },
// };

const sortOptions = [
  { label: "Newest First", value: "-createdAt" },
  { label: "Oldest First", value: "createdAt" },
];

export default function CancelledOrders({ ordersResult }: IProps) {
  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">
        {/* -----------------------------------------
            PAGE HEADER
        ------------------------------------------ */}
        <header className="space-y-1">
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: PRIMARY }}
          >
            Cancelled Orders
          </h1>
          <p className="text-gray-600 text-sm">
            See all orders that were cancelled — reason, payment, customer info.
          </p>
        </header>

        {/* -----------------------------------------
            FILTER BAR
        ------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-3xl shadow-sm border grid grid-cols-1 md:grid-cols-4 gap-4"
          style={{ boxShadow: SHADOW }}
        >
          <AllFilters sortOptions={sortOptions} />
        </motion.div>

        {/* -----------------------------------------
            CANCELLED ORDER LIST (one card per row)
        ------------------------------------------ */}
        <div className="space-y-6">
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
            {ordersResult?.data?.map((o) => (
              <motion.div
                key={o._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0px 8px 32px rgba(0,0,0,0.09)",
                }}
                transition={{ type: "spring", stiffness: 170, damping: 14 }}
              >
                <Card
                  className="rounded-3xl p-6 border bg-white"
                  style={{ boxShadow: SHADOW }}
                >
                  <CardContent className="p-0 space-y-4">
                    {/* TOP ROW */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {o.customerId?.name?.firstName}{" "}
                          {o.customerId?.name?.lastName}
                        </h2>
                        <p className="text-gray-600">
                          {o.vendorId?.businessDetails?.businessName}
                        </p>
                        <p className="text-gray-600">
                          Reason:{" "}
                          <span className="text-yellow-500">
                            {o.cancelReason}
                          </span>
                        </p>

                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                          <Clock size={14} />
                          Cancelled at {format(o.updatedAt, "HH:mm")}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="px-3 py-1 text-xs rounded-full">
                          <Badge className="bg-[#DC3173]">
                            {o.orderStatus}
                          </Badge>
                        </div>

                        <div className="text-2xl font-bold mt-2">
                          {o?.totalPrice?.toFixed(2)}€
                        </div>
                      </div>
                    </div>

                    {/* ITEMS */}
                    {o.items?.map((item, i) => (
                      <div
                        key={item.productId._id}
                        className={cn(
                          "text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-lg",
                          i < o.items.length - 1 && "mb-1.5"
                        )}
                      >
                        Items: {item.productId?.name} x {item.quantity}
                      </div>
                    ))}

                    {/* ADDRESS */}
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <MapPin size={18} className="text-gray-400" />
                      {o.pickupAddress?.street}, {o.pickupAddress?.postalCode},{" "}
                      {o.pickupAddress?.city}, {o.pickupAddress?.state},{" "}
                      {o.pickupAddress?.country}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Payment: {o.paymentMethod}
                      </p>
                    </div>

                    {/* ICON */}
                    <div className="flex justify-end pt-1">
                      <XCircle size={30} className="text-red-600" />
                    </div>
                  </CardContent>
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
