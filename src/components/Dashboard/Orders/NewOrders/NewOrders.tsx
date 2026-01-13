/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import { ORDER_STATUS } from "@/src/consts/order.const";
import { useTranslation } from "@/src/hooks/use-translation";
import {
  orderDispatchReq,
  updateOrderStatusReq,
} from "@/src/services/dashboard/order/order";
import { TMeta } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Brand / colors
const PRIMARY = "#DC3173"; // Deligo primary
const BG_SOFT = "#FFEEF5";
const CARD_BG = "#FFFFFF";
const PINK_SOFT = "#FFE1EC";

const PINK_BORDER = "#FFD0E1";

interface IProps {
  ordersResult: {
    data: TOrder[];
    meta?: TMeta;
  };
}


export default function NewOrders({ ordersResult }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];
  // status updates
  const updateStatus = async (
    id: string,
    status: keyof typeof ORDER_STATUS
  ) => {
    const toastId = toast.loading("Order status updating...");

    try {
      const result = await updateOrderStatusReq(id, status);

      if (result?.success) {
        if (status === "ACCEPTED") {
          await broadcastOrder(id);
        }
        router.refresh();
        toast.success(result.message || "Order status updated successfully!", {
          id: toastId,
        });
        return;
      }
      toast.error(result.message || "Order status update failed", {
        id: toastId,
      });
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

  const accept = (id: string) => updateStatus(id, "ACCEPTED");
  const reject = (id: string) => updateStatus(id, "REJECTED");
  const startPreparing = (id: string) => updateStatus(id, "PREPARING");
  const markReady = (id: string) => updateStatus(id, "READY_FOR_PICKUP");

  // Broadcast order to delivery partners
  const broadcastOrder = async (id: string) => {
    const toastId = toast.loading("Order broadcasting to delivery partners...");

    try {
      const result = await orderDispatchReq(id);

      if (result?.success) {
        router.refresh();
        toast.success(
          result.message ||
          "Order broadcasted to delivery partners successfully!",
          {
            id: toastId,
          }
        );
        return;
      }
      toast.error(
        result.message || "Order broadcast to delivery partners failed",
        {
          id: toastId,
        }
      );
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
        "Order broadcast to delivery partners failed",
        {
          id: toastId,
        }
      );
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG_SOFT }}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${PRIMARY}, #ff5fa2)`,
            }}
          >
            {t("vendor_new_orders")}
          </h1>
        </motion.div>

        <AllFilters sortOptions={sortOptions} />
        <div>
          {/* Orders list */}
          <Card className="lg:col-span-3 bg-white shadow-xl rounded-2xl border border-pink-200">
            <CardHeader>
              <CardTitle
                className="flex items-center gap-2 text-xl font-bold"
                style={{ color: PRIMARY }}
              >
                <span
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ background: PRIMARY }}
                />
                {t("live_orders")}
              </CardTitle>
            </CardHeader>

            <div className="h-[70vh] overflow-y-auto p-4 space-y-4">
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
                    key={order.orderId}
                    layout
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all`}
                    style={{
                      background: order.flash ? PINK_SOFT : CARD_BG,
                      borderColor: PINK_BORDER,
                    }}
                  >
                    <div className="flex justify-between gap-4">
                      {/* Left info */}
                      <div className="flex gap-4 overflow-hidden min-w-0">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm shrink-0"
                          style={{ background: PRIMARY + "22", color: PRIMARY }}
                        >
                          {order.customerId?.name?.firstName?.charAt(0)}
                          {order.customerId?.name?.lastName?.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                              {order.customerId?.name?.firstName}{" "}
                              {order.customerId?.name?.lastName}
                            </h3>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock size={12} />{" "}
                              {formatDistanceToNow(new Date(order.updatedAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>

                          <div className="mt-2 text-sm text-gray-700 leading-5 wrap-break-word">
                            {order.items?.map((item, i) => (
                              <span
                                key={i}
                                className="mr-2 inline-block truncate"
                              >
                                {item?.quantity}× {item.productId?.name}
                              </span>
                            ))}
                          </div>

                          <p className="flex items-center gap-2 text-xs text-gray-500 mt-2 truncate">
                            <MapPin size={12} /> {order.deliveryAddress?.street}
                            , {order.deliveryAddress?.postalCode},{" "}
                            {order.deliveryAddress?.city},{" "}
                            {order.deliveryAddress?.state}
                          </p>
                        </div>
                      </div>

                      {/* Right side: timeline + actions */}
                      <div className="flex flex-col items-end justify-between min-w-[180px]">
                        <StatusBadge status={order.orderStatus} />

                        <div className="flex items-center gap-2 mt-3">
                          {order.orderStatus === ORDER_STATUS.ACCEPTED ||
                            order.orderStatus === ORDER_STATUS.AWAITING_PARTNER ||
                            order.orderStatus ===
                            ORDER_STATUS.REASSIGNMENT_NEEDED ? (
                            <span
                              onClick={() => broadcastOrder(order.orderId)}
                              className="bg-yellow-500 px-2 py-1 text-xs rounded-md inline-flex font-medium"
                            >
                              {t("click_assign_delivery_partner")}
                            </span>
                          ) : (
                            <>
                              {order.orderStatus === ORDER_STATUS.PENDING && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => accept(order.orderId)}
                                    className="bg-[#DC3173] hover:bg-[#DC3173]/90"
                                  >
                                    {t("accept")}
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => reject(order.orderId)}
                                    className="bg-yellow-500 hover:bg-yellow-500/90"
                                  >
                                    {t("reject")}
                                  </Button>
                                </>
                              )}
                              {order.orderStatus === ORDER_STATUS.ASSIGNED && (
                                <Button
                                  size="sm"
                                  onClick={() => startPreparing(order.orderId)}
                                  className="bg-sky-500 hover:bg-sky-600"
                                >
                                  {t("prepare")}
                                </Button>
                              )}
                              {order.orderStatus === ORDER_STATUS.PREPARING && (
                                <Button
                                  size="sm"
                                  onClick={() => markReady(order.orderId)}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  {t("mark_ready")}
                                </Button>
                              )}
                            </>
                          )}

                          <Sheet>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                {t("view")} <ChevronRight size={14} />
                              </Button>
                            </SheetTrigger>
                            <SheetContent
                              side="right"
                              className="w-full md:w-[460px] p-6 overflow-y-auto"
                            >
                              <OrderDetails
                                order={order}
                                onAccept={() => accept(order.orderId)}
                                onReject={() => reject(order.orderId)}
                                onStart={() => startPreparing(order.orderId)}
                                onReady={() => markReady(order.orderId)}
                                onBroadcastOrder={() =>
                                  broadcastOrder(order.orderId)
                                }
                              />
                            </SheetContent>
                          </Sheet>
                        </div>

                        {/* Timeline compact below actions for small screens */}
                        <div className="mt-3">
                          <OrderTimeline status={order.orderStatus} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
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
    </div>
  );
}

/* ----------------- StatusBadge ----------------- */
type TOrderStatus = keyof typeof ORDER_STATUS;
function StatusBadge({ status }: { status: TOrderStatus }) {
  const map: Record<
    TOrderStatus,
    { label: string; bg: string; color: string }
  > = {
    PENDING: { label: "NEW", bg: "#FFE1EC", color: PRIMARY },
    ACCEPTED: { label: "ACCEPTED", bg: "#E8F7FF", color: "#0B67E6" },
    REJECTED: { label: "REJECTED", bg: "#E8F7FF", color: "#0B67E6" },
    AWAITING_PARTNER: {
      label: "AWAITING PARTNER",
      bg: "#FFF4D8",
      color: "#B45309",
    },
    DISPATCHING: { label: "DISPATCHING", bg: "#FFF4D8", color: "#B45309" },
    ASSIGNED: { label: "ASSIGNED", bg: "#FFF4D8", color: "#B45309" },
    REASSIGNMENT_NEEDED: {
      label: "REASSIGNMENT NEEDED",
      bg: "#FFF4D8",
      color: "#B45309",
    },
    PREPARING: { label: "PREPARING", bg: "#FFF4E1", color: "#B45309" },
    READY_FOR_PICKUP: { label: "READY", bg: "#E8FFF0", color: "#0F8A3E" },
    PICKED_UP: { label: "PICKED UP", bg: "#E8FFF0", color: "#0F8A3E" },
    ON_THE_WAY: { label: "ON THE WAY", bg: "#E8FFF0", color: "#0F8A3E" },
    DELIVERED: { label: "DELIVERED", bg: "#E8FFF0", color: "#0F8A3E" },
    CANCELED: { label: "CANCELED", bg: "#E8FFF0", color: "#0F8A3E" },
  };
  const m = map[status];
  return (
    <div
      className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2"
      style={{ background: m.bg, color: m.color }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: m.color }}
      ></span>
      {m.label}
    </div>
  );
}

/* ----------------- OrderTimeline ----------------- */
function OrderTimeline({ status }: { status: TOrderStatus }) {
  const steps: {
    key: keyof Pick<
      typeof ORDER_STATUS,
      "PENDING" | "ACCEPTED" | "ASSIGNED" | "PREPARING" | "READY_FOR_PICKUP"
    >;
    label: string;
  }[] = [
      { key: "PENDING", label: "New" },
      { key: "ACCEPTED", label: "Accepted" },
      { key: "ASSIGNED", label: "Assigned" },
      { key: "PREPARING", label: "Preparing" },
      { key: "READY_FOR_PICKUP", label: "Ready" },
      // { key: "REJECTED", label: "Rejected" },
    ];
  const active = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const isActive = i <= active;
        return (
          <div key={s.key} className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.85, opacity: 0.7 }}
              animate={
                isActive
                  ? {
                    scale: 1.05,
                    opacity: 1,
                    boxShadow: `0 6px 18px ${PRIMARY}33`,
                  }
                  : { scale: 1, opacity: 0.6 }
              }
              transition={{ type: "spring", stiffness: 160, damping: 16 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${isActive
                ? "bg-[--primary] text-white"
                : "bg-white border border-pink-100 text-rose-500"
                }`}
              style={isActive ? { background: PRIMARY, color: "#fff" } : {}}
            >
              {i + 1}
            </motion.div>

            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 ${i < active ? "bg-[--primary]" : "bg-pink-100"
                  }`}
                style={i < active ? { background: PRIMARY } : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ----------------- OrderDetails (sheet content) ----------------- */
function OrderDetails({
  order,
  onAccept,
  onReject,
  onStart,
  onReady,
  onBroadcastOrder,
}: {
  order: TOrder;
  onAccept?: () => void;
  onReject?: () => void;
  onStart?: () => void;
  onReady?: () => void;
  onBroadcastOrder?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-bold">{order.orderId}</h2>
          <p className="text-sm text-gray-600">
            {order.customerId?.name?.firstName}{" "}
            {order.customerId?.name?.lastName} •{" "}
            {formatDistanceToNow(new Date(order.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="text-white" style={{ backgroundColor: PRIMARY }}>
            {order.orderStatus}
          </Badge>
          <div className="text-sm font-semibold">
            {order.totalPrice.toFixed(2)}€
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold">{t("items")}</h3>
        <ul className="mt-2 space-y-2">
          {order.items.map((it, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between p-3 rounded-md bg-gray-50"
            >
              <div className="font-medium">{it.productId?.name}</div>
              <div className="text-sm text-gray-600">{t("qty")} {it.quantity}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">{t("delivery")}</h3>
        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
          <MapPin size={14} /> {order.deliveryAddress?.street},{" "}
          {order.deliveryAddress?.postalCode}, {order.deliveryAddress?.city},{" "}
          {order.deliveryAddress?.state}
        </p>
      </div>

      <div className="flex items-center gap-2 justify-end">
        {order.orderStatus === ORDER_STATUS.ACCEPTED ||
          order.orderStatus === ORDER_STATUS.AWAITING_PARTNER ||
          order.orderStatus === ORDER_STATUS.REASSIGNMENT_NEEDED ? (
          <span
            onClick={() => onBroadcastOrder && onBroadcastOrder()}
            className="bg-yellow-500 px-2 py-1 text-xs rounded-md inline-flex font-medium"
          >
            {t("click_assign_delivery_partner")}
          </span>
        ) : (
          <>
            {order.orderStatus === ORDER_STATUS.PENDING && (
              <>
                <Button
                  size="sm"
                  onClick={() => onAccept && onAccept()}
                  className="bg-[#DC3173] hover:bg-[#DC3173]/90"
                >
                  {t("accept")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => onReject && onReject()}
                  className="bg-yellow-500 hover:bg-yellow-500/90"
                >
                  {t("reject")}
                </Button>
              </>
            )}
            {order.orderStatus === ORDER_STATUS.ACCEPTED && (
              <Button
                size="sm"
                onClick={() => onStart && onStart()}
                className="bg-sky-500 hover:bg-sky-600"
              >
                {t("prepare")}
              </Button>
            )}
            {order.orderStatus === ORDER_STATUS.PREPARING && (
              <Button
                size="sm"
                onClick={() => onReady && onReady()}
                className="bg-green-500 hover:bg-green-600"
              >
                {t("mark_ready")}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// function OverviewMiniCard({
//   title,
//   value,
//   icon,
//   bg,
// }: {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
//   bg: string;
// }) {
//   return (
//     <div
//       className="min-w-[130px] rounded-2xl p-4 flex flex-col items-center justify-center text-center border shadow-md"
//       style={{ background: bg, borderColor: "#FFD0E1" }}
//     >
//       <div className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center mb-3">
//         {icon}
//       </div>

//       <div className="text-2xl font-extrabold text-gray-900">{value}</div>

//       <div className="text-sm font-medium text-gray-700 mt-1">{title}</div>
//     </div>
//   );
// }
