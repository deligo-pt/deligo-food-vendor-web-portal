/* app/vendor/ongoing-deliveries/page.tsx */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";

const PRIMARY = "#DC3173";

interface IProps {
  ordersResult: {
    data: TOrder[];
    meta?: TMeta;
  };
}

export default function OngoingDeliveries({ ordersResult }: IProps) {
  const { t } = useTranslation();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* HEADER */}
      <TitleHeader
        title={t("ongoing_deliveries")}
        subtitle={t("track_your_live_orders")}
      />

      {/* FILTERS */}
      <AllFilters sortOptions={sortOptions} />

      {/* ORDER LIST */}
      <div className="space-y-5">
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
          {ordersResult?.data?.map((d) => (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <DeliveryCard delivery={d} />
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

/* -----------------------------------
   Delivery Card Component
------------------------------------ */
function DeliveryCard({ delivery: d }: { delivery: TOrder }) {
  const { t } = useTranslation();
  return (
    <Card className="rounded-3xl shadow-sm border bg-white p-6">
      <CardContent className="space-y-6 p-0">
        {/* top row */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold text-xl">
              {d.customerId?.name?.firstName} {d.customerId?.name?.lastName}
            </h2>
            <p className="text-gray-700">
              {d.vendorId?.businessDetails?.businessName}
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
              <Clock size={16} /> {format(d.updatedAt, "hh:mm a")}
            </div>
          </div>
        </div>

        {/* items */}
        {d.items?.map((item, i) => (
          <div
            key={item.productId._id}
            className={cn(
              "text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-lg",
              i < d.items.length - 1 && "mb-1.5",
            )}
          >
            {t("items")}: {item.productId?.name} x {item.quantity}
          </div>
        ))}

        {/* address */}
        <p className="text-sm flex items-center gap-2 text-gray-700">
          <MapPin size={18} className="text-gray-500" />{" "}
          {d.pickupAddress?.street}, {d.pickupAddress?.postalCode},{" "}
          {d.pickupAddress?.city}, {d.pickupAddress?.state},{" "}
          {d.pickupAddress?.country}
        </p>

        {/* rider */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              style={{
                background: PRIMARY + "20",
                color: PRIMARY,
              }}
            >
              {d.deliveryPartnerId?.name?.firstName?.charAt(0)}
              {d.deliveryPartnerId?.name?.lastName?.charAt(0)}
            </div>
            <div>
              <p className="font-medium">
                {d.deliveryPartnerId?.name?.firstName}{" "}
                {d.deliveryPartnerId?.name?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {t("rider_id")}: {d.deliveryPartnerId?.userId}
              </p>
            </div>
          </div>

          <a
            href={`tel:${d.deliveryPartnerId?.contactNumber}`}
            className="flex items-center gap-2"
          >
            <Phone size={16} /> {t("call_rider")}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
