"use client";

import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { TIngredientOrder } from "@/src/types/ingredient.type";
import { formatPrice } from "@/src/utils/formatPrice";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, Clock, Package, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps {
  ordersData: { data: TIngredientOrder[]; meta?: TMeta };
}

export default function MyIngredientOrders({ ordersData }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  const getStatusColor = (status: TIngredientOrder["orderStatus"]) => {
    switch (status) {
      case "DELIVERED":
        return "text-[#DC3173] bg-[#DC3173]/10 border-[#DC3173]/20";
      case "SHIPPED":
        return "text-indigo-600 bg-indigo-50 border-indigo-100";
      case "CONFIRMED":
        return "text-green-600 bg-green-50 border-green-100";
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-100";
    }
  };

  const getStatusIcon = (status: TIngredientOrder["orderStatus"]) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle size={16} />;
      case "SHIPPED":
        return <Truck size={16} />;
      case "CONFIRMED":
        return <Package size={16} />;
      case "PENDING":
        return <Clock size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="min-h-screen">
        {/* Header */}
        <TitleHeader
          title="My Ingredient Orders"
          subtitle="Track status of your ingredient purchases"
        />

        {/* Filters */}
        <AllFilters sortOptions={sortOptions} />

        {/* Orders List */}
        <div className="space-y-4 mb-4">
          {ordersData.data?.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#DC3173]/10 rounded-xl text-[#DC3173]">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {order.orderId}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Placed on{" "}
                      {format(order.createdAt, "do MMM yyyy, hh:mm a")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                        {order?.orderDetails?.ingredient?.name} (x
                        {order?.orderDetails?.totalQuantity})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 min-w-[200px]">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      €{formatPrice(order.grandTotal || 0)}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      router.push(
                        `/vendor/ingredients/my-orders/${order.orderId}`,
                      )
                    }
                    className="p-2 text-gray-400 hover:text-[#DC3173] hover:bg-[#DC3173]/10 rounded-full transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {ordersData.meta?.total === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-gray-100 rounded-full text-gray-400 mb-4">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
              <p className="text-gray-500">
                Start ordering ingredients to see them here.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!!ordersData?.meta?.totalPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PaginationComponent
              totalPages={ordersData?.meta?.totalPage as number}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
