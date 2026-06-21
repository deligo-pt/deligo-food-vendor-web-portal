"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { TBulkDiscount, TIngredientOrder, TIngredientOrderDetail } from "@/src/types/ingredient.type";
import { formatPrice } from "@/src/utils/formatPrice";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Receipt,
  Tag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IProps {
  orderData: TIngredientOrder;
}

export function IngredientOrderDetails({ orderData }: IProps) {
  const router = useRouter();

  const getStatusBadge = (status: TIngredientOrder["orderStatus"]) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle size={14} /> Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck size={14} /> Shipped
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Package size={14} /> Confirmed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/vendor/ingredients/my-orders"
            className="inline-flex items-center gap-2 text-[#DC3173] font-medium hover:underline mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to My Ingredient Orders
          </Link>
          <TitleHeader
            title={`Order #${orderData.orderId}`}
            subtitle={`Placed on ${format(new Date(orderData.createdAt), "do MMM yyyy, hh:mm a")}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Items Ordered List Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Items Ordered</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {orderData.orderDetails?.map((item: TIngredientOrderDetail, idx: number) => {
                  const ingredientRef = item.ingredientId || {};
                  const isAvailable = ingredientRef.status === "available";

                  // Calculate discount thresholds applied to this transaction line
                  const matchingBulkOffer = ingredientRef.bulkDiscount?.find(
                    (tier: TBulkDiscount) => item.quantity >= tier.minQty
                  );

                  return (
                    <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden relative shrink-0">
                          <Image
                            src={ingredientRef.image || "/placeholder-ingredient.jpg"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {item.sku}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            €{formatPrice(item.pricePerUnit)} x {item.quantity} {item.unit || "units"}
                          </p>

                          {/* Dynamic Stock Status Profiles */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                              }`}>
                              ● Market Source: {ingredientRef.status || "unspecified"}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">
                              Current Stock Pool: {ingredientRef.stock ?? "N/A"} units
                            </span>
                          </div>

                          {/* Dynamic Bulk Pricing Offer Status indicator */}
                          {matchingBulkOffer && (
                            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-2 border border-amber-100">
                              <Tag size={12} /> Bulk Volume Tier Triggered (€{matchingBulkOffer.discountPrice}/{item.unit})
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right sm:self-center">
                        <p className="font-bold text-lg text-gray-900">
                          €{formatPrice(item.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-400">Includes {item.taxRate}% VAT</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Tracking Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Logistics & Handling</h3>
                  {orderData.statusHistory?.deliveredAt ? (
                    <p className="text-sm text-gray-600">
                      Delivered successfully on{" "}
                      <span className="font-semibold text-gray-900">
                        {format(new Date(orderData.statusHistory.deliveredAt), "do MMM yyyy 'at' hh:mm a")}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Estimated fulfillment cycle completes within <span className="font-bold text-gray-900">2-3 operating days</span>.
                    </p>
                  )}
                </div>
              </div>

              {orderData.deliveryAddress && (
                <div className="pt-4 border-t border-gray-50 flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-500 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div className="text-sm">
                    <h4 className="font-bold text-gray-800 mb-0.5">Shipping Destination</h4>
                    <p className="text-gray-500">
                      {orderData.deliveryAddress.street}, {orderData.deliveryAddress.city},{" "}
                      {orderData.deliveryAddress.postalCode}, {orderData.deliveryAddress.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar Financial Calculators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Detailed Ledger Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt size={18} className="text-gray-400" /> Order Financial Matrix
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Products Net Base</span>
                  <span className="font-medium text-gray-800">
                    €{formatPrice(orderData.orderCalculation?.totalOriginalPrice || 0)}
                  </span>
                </div>
                {orderData.orderCalculation?.totalProductDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Wholesale Adjustment</span>
                    <span>-€{formatPrice(orderData.orderCalculation.totalProductDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Total Tax Amount</span>
                  <span className="font-medium text-gray-800">
                    €{formatPrice(orderData.orderCalculation?.totalTaxAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 pb-3 border-b border-gray-50">
                  <span>Distribution Logistics Fee</span>
                  <span className="font-medium text-gray-800">
                    €{formatPrice(orderData.delivery?.totalDeliveryCharge || 0)}
                  </span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Grand Total Total</span>
                  <span className="font-black text-[#DC3173] text-2xl">
                    €{formatPrice(orderData.grandTotal)}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Method: <strong className="text-gray-800">{orderData.paymentMethod}</strong></span>
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold uppercase tracking-wider">
                  {orderData.paymentStatus}
                </span>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between font-medium text-gray-500">
                Status: {getStatusBadge(orderData?.orderStatus)}
              </div>
            </div>

            {/* Help / Support Link Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-1">Need Assistance?</h3>
              <p className="text-xs text-gray-400 mb-4">
                Reference Order ID <span className="font-mono font-bold text-gray-600">{orderData.orderId}</span> for immediate pipeline routing checkups.
              </p>
              <button
                onClick={() => router.push("/vendor/chat-support")}
                className="w-full py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Contact Support Lines
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}