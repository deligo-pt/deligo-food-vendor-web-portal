"use client";

import { TIngredientOrder } from "@/src/types/ingredient.type";
import { formatPrice } from "@/src/utils/formatPrice";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Clock, Package, Truck } from "lucide-react";
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-[#DC3173]/10 text-[#DC3173]">
            <CheckCircle size={14} /> Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700">
            <Truck size={14} /> Shipped
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
            <Package size={14} /> Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-100 text-amber-700">
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-4">
          <Link
            href="/vendor/ingredients/my-orders"
            className="inline-flex items-center gap-2 text-[#DC3173] hover:underline mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to My Ingredient Orders
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                Order #{orderData.orderId}
                {getStatusBadge(orderData.orderStatus)}
              </h1>
              <p className="text-gray-500 mt-1">
                Placed on {format(orderData.createdAt, "do MMM yyyy, hh:mm a")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Items List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Items Ordered
                </h2>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center text-3xl">
                    <Image
                      src={orderData.orderDetails?.ingredient?.image}
                      alt={orderData.orderDetails?.ingredient?.name as string}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {orderData.orderDetails?.ingredient?.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      €
                      {(
                        orderData.orderDetails?.ingredient?.price || 0
                      )?.toFixed(2)}{" "}
                      x {orderData.orderDetails?.totalQuantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    €
                    {(
                      orderData.orderDetails?.totalQuantity *
                      (orderData.orderDetails?.ingredient?.price || 0)
                    )?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Estimated Delivery
                </h3>
                <p className="text-gray-600">
                  Your order is expected to arrive by{" "}
                  <span className="font-bold text-gray-900">
                    2/3 days from now
                  </span>
                  . We will notify you once it ships.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{formatPrice(orderData.grandTotal)}</span>
                </div>
                {/* <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>€{orderData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div> */}
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="font-bold text-[#DC3173] text-xl">
                    €{formatPrice(orderData.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Have an issue with your order? Contact our support team.
              </p>
              <button
                onClick={() => router.push("/vendor/chat-support")}
                className="w-full py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
