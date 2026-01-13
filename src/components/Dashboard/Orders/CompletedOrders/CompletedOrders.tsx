"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import { TMeta } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { format } from "date-fns";
import { CheckCircle, Clock, MapPin } from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";

interface IProps {
  ordersResult: {
    data: TOrder[];
    meta?: TMeta;
  };
}

/* ----------------------------------------
   THEME COLORS (Deligo Premium)
------------------------------------------ */
const PRIMARY = "#DC3173"; // brand
const BG = "#FFF5FA"; // soft background
const SHADOW = "0px 4px 24px rgba(0,0,0,0.07)"; // premium shadow


export default function CompletedOrders({ ordersResult }: IProps) {
  const { t } = useTranslation();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  const filterOptions = [
    {
      label: t("payment_method"),
      key: "payment",
      placeholder: t("select_payment_method"),
      type: "select",
      items: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Card",
          value: "CARD",
        },
        {
          label: "Mobile",
          value: "MOBILE",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">
        {/* PAGE HEADER */}
        <div className="space-y-1">
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ color: PRIMARY }}
          >
            {t("completed_orders")}
          </h1>
          <p className="text-gray-600 text-sm">
            {t("fully_delivered_orders_with_earnings_rider_data")}
          </p>
        </div>

        {/* FILTER BAR */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-3xl shadow-sm border"
          style={{ boxShadow: SHADOW }}
        >
          <AllFilters sortOptions={sortOptions} filterOptions={filterOptions} />
        </motion.div>

        {/* COMPLETED ORDER LIST */}
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
                transition={{ type: "spring", stiffness: 180, damping: 15 }}
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
                          <Clock size={14} /> {t("delivered_at")}{" "}
                          {format(o.deliveredAt as Date, "hh:mm a; dd/MM/yyyy")}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className="px-3 py-1 text-xs rounded-full"
                          style={{
                            background: PRIMARY + "18",
                            color: PRIMARY,
                          }}
                        >
                          {t("completed")}
                        </div>
                        <div className="text-2xl font-bold mt-2">
                          {o.totalPrice?.toFixed(2)}€
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
                        {t("items")}: {item.productId?.name} x {item.quantity}
                      </div>
                    ))}

                    {/* ADDRESS */}
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <MapPin size={18} className="text-gray-400" />
                      {o.deliveryAddress?.street},{" "}
                      {o.deliveryAddress?.postalCode}, {o.deliveryAddress?.city}
                      , {o.deliveryAddress?.country}
                    </div>

                    {/* RIDER + PAYMENT */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                          style={{
                            background: PRIMARY + "20",
                            color: PRIMARY,
                          }}
                        >
                          {o.deliveryPartnerId?.name?.firstName?.charAt(0)}
                          {o.deliveryPartnerId?.name?.lastName?.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {o.deliveryPartnerId?.name?.firstName}{" "}
                            {o.deliveryPartnerId?.name?.lastName}
                          </p>
                          {/* <p className="text-xs text-gray-500">
                            Distance: {o.distance} km
                          </p> */}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        {t("payment")}:{" "}
                        <span className="font-semibold uppercase text-gray-900">
                          {o.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* CHECK ICON */}
                    <div className="flex justify-end pt-1">
                      <CheckCircle size={30} className="text-green-600" />
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
