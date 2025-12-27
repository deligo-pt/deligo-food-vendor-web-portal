"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

import AllFilters from "@/src/components/Filtering/AllFilters";
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
            {ordersResult?.data?.map((o) => {
              //   const reason = REASON_LABEL[o.cancelReason as string];

              return (
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

                          <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                            <Clock size={14} />
                            Cancelled at {format(o.updatedAt, "HH:mm")}
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className="px-3 py-1 text-xs rounded-full"
                            // style={{
                            //   background: reason.color + "18",
                            //   color: reason.color,
                            // }}
                          >
                            {o.cancelReason}
                          </div>

                          <div className="text-2xl font-bold mt-2">
                            {o?.finalAmount?.toFixed(2)}€
                          </div>
                        </div>
                      </div>

                      {/* ITEMS */}
                      <div className="text-sm text-gray-700">
                        Items: {o.items.join(", ")}
                      </div>

                      {/* ADDRESS */}
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <MapPin size={18} className="text-gray-400" />
                        {o.pickupAddress?.street}, {o.pickupAddress?.postalCode}
                        , {o.pickupAddress?.city}, {o.pickupAddress?.state},{" "}
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
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
