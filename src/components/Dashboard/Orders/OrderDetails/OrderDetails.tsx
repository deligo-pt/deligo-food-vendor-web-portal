"use client";

import OrderItemsTable from "@/src/components/Dashboard/Orders/OrderDetails/OrderItemsTable";
import OrderPricingSummary from "@/src/components/Dashboard/Orders/OrderDetails/OrderPricingSummary";
import { useTranslation } from "@/src/hooks/use-translation";
import { TOrderDetails } from "@/src/types/order.type";
import { format } from "date-fns";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeftIcon,
  BikeIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  StoreIcon,
  CreditCardIcon,
  ClockIcon,
  FileTextIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IProps {
  order: TOrderDetails;
}

export default function OrderDetails({ order }: IProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-indigo-100 text-indigo-800";
      case "READY":
        return "bg-purple-100 text-purple-800";
      case "OUT_FOR_DELIVERY":
        return "bg-orange-100 text-orange-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <motion.div
        className="bg-white rounded-xl shadow-xl overflow-hidden min-h-screen md:min-h-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-[#DC3173] to-[#e45a92] p-6 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {t("order_lg")} #{order.orderId}
                </h1>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
                {order.flash && (
                  <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded uppercase">
                    {t("flash")}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm mt-2">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCardIcon className="w-4 h-4" />
                  <span>
                    {order.paymentMethod} · {order.paymentStatus}
                    {order.isPaid && " ✓"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <motion.div variants={itemVariants as Variants}>
              <OrderItemsTable items={order.items} t={t} />
            </motion.div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup */}
              {order.pickupAddress && (
                <motion.div
                  variants={itemVariants as Variants}
                  className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4 text-[#DC3173]">
                    <StoreIcon className="w-5 h-5" />
                    <h3 className="font-semibold text-gray-900">
                      {t("pickup_location") || "Pickup Location"}
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="font-medium text-gray-900">
                      {order.pickupAddress.street}
                    </div>
                    <div className="text-gray-600 flex items-start gap-2">
                      <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                      <span>
                        {order.pickupAddress.city}
                        {order.pickupAddress.state
                          ? `, ${order.pickupAddress.state}`
                          : ""}
                        <br />
                        {order.pickupAddress.postalCode}
                        {order.pickupAddress.country
                          ? `, ${order.pickupAddress.country}`
                          : ""}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Delivery */}
              <motion.div
                variants={itemVariants as Variants}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4 text-[#DC3173]">
                  <MapPinIcon className="w-5 h-5" />
                  <h3 className="font-semibold text-gray-900">
                    {t("delivery_address")}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="font-medium text-gray-900">
                    {order.customerId.name?.firstName}{" "}
                    {order.customerId.name?.lastName}
                  </div>
                  <div className="text-sm text-gray-600 flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                    <span>
                      {order.deliveryAddress.street}
                      <br />
                      {order.deliveryAddress.city}
                      {order.deliveryAddress.state
                        ? `, ${order.deliveryAddress.state}`
                        : ""}
                      <br />
                      {order.deliveryAddress.postalCode}
                      {order.deliveryAddress.country
                        ? `, ${order.deliveryAddress.country}`
                        : ""}
                    </span>
                  </div>
                  {order.customerId.NIF && (
                    <div className="text-sm text-gray-500 pt-2 border-t border-gray-100">
                      {t("nif")}: {order.customerId.NIF}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Status History */}
            {order.statusHistory?.length > 0 && (
              <motion.div
                variants={itemVariants as Variants}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-[#DC3173]" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {t("status_history") || "Status History"}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {order.statusHistory.map((entry, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-2.5 h-2.5 rounded-full mt-1.5 ${idx === 0 ? "bg-[#DC3173]" : "bg-gray-300"
                              }`}
                          />
                          {idx < order.statusHistory.length - 1 && (
                            <div className="w-px flex-1 bg-gray-200 my-1" />
                          )}
                        </div>
                        <div className="pb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded ${statusColor(
                                entry.status
                              )}`}
                            >
                              {entry.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(
                                new Date(entry.timestamp),
                                "dd MMM yyyy, HH:mm"
                              )}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-sm text-gray-600 mt-1">
                              {entry.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Invoice Sync / Remarks */}
            {(order.invoiceSync || order.remarks) && (
              <motion.div
                variants={itemVariants as Variants}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center gap-2 mb-3 text-[#DC3173]">
                  <FileTextIcon className="w-4 h-4" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {t("additional_info") || "Additional Info"}
                  </h3>
                </div>
                {order.remarks && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{t("remarks")}:</span> {order.remarks}
                  </p>
                )}
                {order.invoiceSync && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{t("invoice_sync")}:</span>{" "}
                    {order.invoiceSync.isSynced ? (
                      <span className="text-green-600">{t("synced")}</span>
                    ) : (
                      <span className="text-red-600">
                        {t("failed")}
                        {order.invoiceSync.syncError
                          ? ` — ${order.invoiceSync.syncError}`
                          : ""}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pricing */}
            <motion.div variants={itemVariants as Variants}>
              <OrderPricingSummary order={order} t={t} />
            </motion.div>

            {/* Customer */}
            <motion.div
              variants={itemVariants as Variants}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#DC3173]" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  {t("customer_details")}
                </h3>
              </div>
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {order.customerId.profilePhoto ? (
                    <Image
                      src={order.customerId.profilePhoto}
                      alt="Customer"
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <UserIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {order.customerId.name?.firstName}{" "}
                    {order.customerId.name?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t("id")}: {order.customerId.userId}
                  </div>
                  {order.customerId.NIF && (
                    <div className="text-xs text-gray-500">
                      {t("nif")}: {order.customerId.NIF}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Delivery Partner */}
            {order.deliveryPartnerId && (
              <motion.div
                variants={itemVariants as Variants}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <BikeIcon className="w-4 h-4 text-[#DC3173]" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {t("delivery_partner")}
                  </h3>
                </div>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {order.deliveryPartnerId.profilePhoto ? (
                      <Image
                        src={order.deliveryPartnerId.profilePhoto}
                        alt="Driver"
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <BikeIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.deliveryPartnerId.name?.firstName}{" "}
                      {order.deliveryPartnerId.name?.lastName}
                    </div>
                    {order.deliveryPartnerId.contactNumber && (
                      <div className="text-xs text-gray-500">
                        {order.deliveryPartnerId.contactNumber}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants as Variants}
              className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
            >
              <h3 className="font-semibold text-gray-900 text-sm">
                {t("order_summary") || "Order Summary"}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">{t('items')}</div>
                  <div className="font-medium">{order.totalQuantity}</div>
                </div>
                <div>
                  <div className="text-gray-500">{t("payment")}</div>
                  <div className="font-medium">{order.paymentStatus}</div>
                </div>
                <div>
                  <div className="text-gray-500">{t("transaction")}</div>
                  <div className="font-medium text-xs truncate">
                    {order.transactionId || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">{t("refund")}</div>
                  <div className="font-medium">{order.refundStatus}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}