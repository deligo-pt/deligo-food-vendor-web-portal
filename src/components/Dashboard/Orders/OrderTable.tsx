"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useTranslation } from "@/src/hooks/use-translation";
import { TOrder } from "@/src/types/order.type";
import { formatPrice } from "@/src/utils/formatPrice";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,          // ← added
  Cog,
  EuroIcon,
  EyeIcon,
  HashIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps {
  orders: TOrder[];
}

export default function OrderTable({ orders }: IProps) {
  const { t } = useTranslation();
  const router = useRouter();

  // Helper to format pickup hour range
  const formatPickupHour = (order: TOrder) => {
    if (
      order.fulfillmentType !== "PICKUP" ||
      !order.pickup?.pickupTime ||
      !order.pickup?.pickupSlotEndTime
    ) {
      return "—";
    }

    // Remove the trailing Z so the time is treated as local (no timezone shift)
    const start = format(
      new Date(order.pickup.pickupTime.replace(/Z$/, "")),
      "h:mm a"
    );
    const end = format(
      new Date(order.pickup.pickupSlotEndTime.replace(/Z$/, "")),
      "h:mm a"
    );

    return `${start} - ${end}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-2 overflow-x-auto"
    >
      <Table className="max-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <HashIcon className="w-4" />
                {t("order_id")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <UserIcon className="w-4" />
                {t("customer")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <PackageIcon className="w-4" />
                {t("items")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <EuroIcon className="w-4" />
                {t("amount")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CalendarIcon className="w-4" />
                {t("date")}
              </div>
            </TableHead>

            {/* NEW Hour column */}
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <ClockIcon className="w-4" />
                {t("hour")}
              </div>
            </TableHead>

            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CheckCircleIcon className="w-4" />
                {t("status")}
              </div>
            </TableHead>
            <TableHead className="text-right text-[#DC3173] flex gap-2 items-center justify-end">
              <Cog className="w-4" />
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders?.length === 0 && (
            <TableRow>
              <TableCell
                className="text-[#DC3173] text-lg text-center"
                colSpan={8}
              >
                {t("no_orders_found")}
              </TableCell>
            </TableRow>
          )}

          {orders?.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.orderId}</TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={order.customerId?.profilePhoto} />
                    <AvatarFallback>
                      {order.customerId?.name?.firstName?.charAt(0)}
                      {order.customerId?.name?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {order.customerId?.name?.firstName || "N/A"}{" "}
                      {order.customerId?.name?.lastName}
                    </div>
                    {order.deliveryAddress && (
                      <div className="text-xs text-slate-500">
                        {order.deliveryAddress.street},{" "}
                        {order.deliveryAddress.city}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                {order.items?.map((i, index) => (
                  <span key={index}>
                    {i.name} x {i.itemSummary?.quantity}
                  </span>
                ))}
              </TableCell>

              <TableCell>
                €
                {formatPrice(
                  (order?.payoutSummary?.vendor?.vendorNetPayout || 0) +
                  (order?.payoutSummary?.deliGoCommission?.totalDeduction || 0),
                )}
              </TableCell>

              <TableCell>
                {format(new Date(order.createdAt), "dd-MM-yyyy")}
              </TableCell>

              {/* NEW Hour cell – only meaningful for PICKUP */}
              <TableCell>
                {formatPickupHour(order)}
              </TableCell>

              <TableCell>{order.orderStatus}</TableCell>

              <TableCell className="text-right">
                <Button
                  onClick={() =>
                    router.push(`/vendor/all-orders/${order.orderId}`)
                  }
                  size="sm"
                  className="bg-[#DC3173] flex items-center gap-2 hover:bg-[#DC3173]/90 ml-auto"
                >
                  <EyeIcon />
                  {t("view")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}