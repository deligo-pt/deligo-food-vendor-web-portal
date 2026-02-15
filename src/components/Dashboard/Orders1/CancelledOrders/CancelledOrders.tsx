"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
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

const SHADOW = "0px 4px 24px rgba(0,0,0,0.07)";

export default function CancelledOrders({ ordersResult }: IProps) {
  const { t } = useTranslation();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* HEADER */}
      <TitleHeader
        title={t("cancelled_orders")}
        subtitle={t("see_all_orders_were_cancelled")}
      />

      {/* FILTERS */}
      <AllFilters sortOptions={sortOptions} />

      {/* ORDERS LIST */}
      <div className="space-y-6">
        <AnimatePresence>
          {ordersResult?.data?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-gray-500"
            >
              {t("no_orders_match_query")}
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
                        {t("reason")}:{" "}
                        <span className="text-yellow-500">
                          {o.cancelReason}
                        </span>
                      </p>

                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                        <Clock size={14} />
                        {t("cancelled_at")} {format(o.updatedAt, "HH:mm")}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="px-3 py-1 text-xs rounded-full">
                        <Badge className="bg-[#DC3173]">{o.orderStatus}</Badge>
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
                        i < o.items.length - 1 && "mb-1.5",
                      )}
                    >
                      {t("items")}: {item.productId?.name} x {item.quantity}
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
                      {t("payment")}: {o.paymentMethod}
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
  );
}
