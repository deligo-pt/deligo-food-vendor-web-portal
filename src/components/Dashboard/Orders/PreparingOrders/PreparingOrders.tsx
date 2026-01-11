"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CancelOrderModal from "@/src/components/Dashboard/Orders/OrderCancelModal/OrderCancelModal";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import { ORDER_STATUS } from "@/src/consts/order.const";
import { useTranslation } from "@/src/hooks/use-translation";
import { updateOrderStatusReq } from "@/src/services/dashboard/order/order";
import { TMeta } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface IProps {
  ordersResult: {
    data: TOrder[];
    meta?: TMeta;
  };
}

const DELIGO = "#DC3173";


export default function PreparingOrders({ ordersResult }: IProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [cancelId, setCancelId] = useState<string | null>(null);

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  // status updates
  const updateStatus = async (
    id: string,
    status: keyof typeof ORDER_STATUS,
    reason?: string
  ) => {
    const toastId = toast.loading("Order status updating...");

    try {
      const result = await updateOrderStatusReq(id, status, reason);

      if (result?.success) {
        router.refresh();
        toast.success(result.message || "Order status updated successfully!", {
          id: toastId,
        });
        return;
      }
      toast.error(result.message || "Order status update failed", {
        id: toastId,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Order status update failed",
        {
          id: toastId,
        }
      );
    }
  };

  // actions
  const markReady = (id: string) => updateStatus(id, "READY_FOR_PICKUP");

  const cancelOrder = (id: string) => setCancelId(id);

  return (
    <div className="min-h-screen p-6 md:p-10 bg-linear-to-br from-gray-50 to-white">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: DELIGO }}>
              {t("preparing_orders")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {t("manage_orders_in_kitchen")}
            </p>
          </div>
        </div>
        <AllFilters sortOptions={sortOptions} />

        {/* content */}
        <div>
          <Card className="col-span-2 p-0 overflow-hidden rounded-2xl shadow-lg">
            <CardHeader className="flex items-center justify-between p-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: DELIGO }}
                />
                {t("preparing")} ({ordersResult?.meta?.total})
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              {/* animated list */}
              <div className="space-y-4">
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
                  {ordersResult?.data?.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 18,
                      }}
                      className="bg-white rounded-2xl shadow-sm p-4 flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center"
                    >
                      <div className="flex items-start gap-3 md:items-center min-w-0 w-full">
                        <div className="shrink-0">
                          <div
                            className="w-14 h-14 rounded-xl bg-[rgba(220,49,115,0.08)] flex items-center justify-center text-xl font-bold"
                            style={{ color: DELIGO }}
                          >
                            {order.customerId?.name?.firstName?.charAt(0)}
                            {order.customerId?.name?.lastName?.charAt(0)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg truncate">
                                  {order.customerId?.name?.firstName}{" "}
                                  {order.customerId?.name?.lastName}
                                </h3>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock size={14} />{" "}
                                  {format(order?.updatedAt, "HH:mm")}
                                </div>
                              </div>

                              <div className="text-sm text-gray-700 mt-2 leading-5 wrap-break-word">
                                {order.items.map((it, i) => (
                                  <span key={i} className="inline-block mr-3">
                                    {it.quantity}× {it.productId?.name}
                                  </span>
                                ))}
                              </div>

                              <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin size={12} />{" "}
                                  <span className="truncate">
                                    {order.pickupAddress?.street},{" "}
                                    {order.pickupAddress?.postalCode},{" "}
                                    {order.pickupAddress?.city},{" "}
                                    {order.pickupAddress?.state},{" "}
                                    {order.pickupAddress?.country}
                                  </span>
                                </div>
                                {/* <Badge variant="outline">{order.eta}</Badge> */}
                              </div>
                            </div>
                          </div>

                          {/* rider info & small actions for mobile (stacked) */}
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1 text-gray-600">
                              <User size={14} />{" "}
                              {order.deliveryPartnerId?.name?.firstName &&
                                order.deliveryPartnerId?.name?.lastName
                                ? `${order.deliveryPartnerId?.name?.firstName} ${order.deliveryPartnerId?.name?.lastName}`
                                : "Unassigned"}
                            </span>
                            <span className="text-gray-400">·</span>
                            <span className="text-xs text-gray-500">
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* actions */}
                      <div className="shrink-0 flex flex-col items-end gap-2 md:items-center">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => markReady(order.orderId)}
                            style={{ background: DELIGO, color: "#fff" }}
                          >
                            {t("mark_ready")}
                          </Button>
                        </div>

                        <div className="mt-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelOrder(order.orderId)}
                          >
                            {t("cancel")}
                          </Button>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button size="sm" variant="ghost">
                                {t("details")}
                              </Button>
                            </SheetTrigger>
                            <SheetContent
                              side="right"
                              className="w-full md:w-[480px] p-6 overflow-y-auto"
                            >
                              <OrderSheetContent
                                order={order}
                                onReady={() => markReady(order.orderId)}
                                onCancel={() => cancelOrder(order.orderId)}
                              />
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
        {!!ordersResult?.meta?.total && ordersResult?.meta?.total > 0 && (
          <div className="px-6 pb-4">
            <PaginationComponent
              totalPages={ordersResult?.meta?.totalPage || 0}
            />
          </div>
        )}
      </div>
      <CancelOrderModal
        open={!!cancelId}
        onOpenChange={(open) => {
          if (!open) setCancelId(null);
        }}
        orderId={cancelId || ""}
        updateStatus={updateStatus}
      />
    </div>
  );
}

/* ---------- small subcomponents ---------- */

// function ProgressBar({ value }: { value: number }) {
//   const safe = Math.max(0, Math.min(100, Math.round(value)));
//   return (
//     <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
//       <motion.div
//         initial={{ width: 0 }}
//         animate={{ width: `${safe}%` }}
//         transition={{ type: "spring", stiffness: 100, damping: 20 }}
//         className="h-3 rounded-full"
//         style={{ background: `linear-gradient(90deg, ${DELIGO}, #ff7fb3)` }}
//       />
//       <div className="mt-1 text-xs text-gray-500">{safe}%</div>
//     </div>
//   );
// }

function OrderSheetContent({
  order,
  onReady,
  onCancel,
}: {
  order: TOrder;
  onReady?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">
          {order.customerId?.name?.firstName} {order.customerId?.name?.lastName}
        </h3>
        <div className="text-sm text-gray-600">
          {order.orderId} • {format(order.updatedAt, "HH:mm")}
        </div>
      </div>

      <div>
        <h4 className="font-semibold">Items</h4>
        <ul className="mt-2 space-y-2">
          {order.items.map((it, i) => (
            <li
              key={i}
              className="flex justify-between items-center p-3 rounded-md bg-gray-50"
            >
              <div>{it.productId?.name}</div>
              <div className="text-sm text-gray-600">Qty {it.quantity}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold">Delivery</h4>
        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
          <MapPin size={14} /> {order.pickupAddress?.street},{" "}
          {order.pickupAddress?.postalCode}, {order.pickupAddress?.city},{" "}
          {order.pickupAddress?.state}, {order.pickupAddress?.country}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onReady && onReady()}
          >
            Mark Ready
          </Button>
        </div>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onCancel && onCancel()}
        >
          Cancel Order
        </Button>
      </div>
    </div>
  );
}
