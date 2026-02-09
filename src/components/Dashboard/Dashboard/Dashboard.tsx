"use client";

import DashboardHeader from "@/src/components/Dashboard/Dashboard/DashboardHeader";
import PopularCategories from "@/src/components/Dashboard/Dashboard/PopularCategories";
import RecentOrders from "@/src/components/Dashboard/Dashboard/RecentOrders";
import StatCard from "@/src/components/Dashboard/Dashboard/StatCard";
import StatusCard from "@/src/components/Dashboard/Dashboard/StatusCard";
import TopProducts from "@/src/components/Dashboard/Dashboard/TopProducts";
import { useTranslation } from "@/src/hooks/use-translation";
import { TAnalytics } from "@/src/types/analytics.type";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  StoreIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";

interface IProps {
  vendorName: string;
  analyticsData: TAnalytics;
}

const Dashboard = ({ vendorName, analyticsData }: IProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <DashboardHeader vendorName={vendorName} />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
      >
        <StatCard
          title={t("total_items")}
          value={analyticsData?.products?.total?.toLocaleString() || "0"}
          description={t("total_listed_products")}
          icon={<StoreIcon />}
          color="#DC3173"
        />
        <StatCard
          title={t("active_products")}
          value={analyticsData?.products?.active?.toLocaleString() || "0"}
          description={t("items_for_sale")}
          icon={<TruckIcon />}
          color="#DC3173"
        />
        <StatCard
          title={t("inactive_products")}
          value={analyticsData?.products?.inactive?.toLocaleString() || "0"}
          description={t("items_not_for_sale")}
          icon={<UsersIcon />}
          color="#DC3173"
        />
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.4,
        }}
      >
        <StatusCard
          title={t("total_orders")}
          value={analyticsData?.orders?.total?.toLocaleString() || "0"}
          icon={<ShoppingBagIcon />}
          color="#DC3173"
        />
        <StatusCard
          title={t("pending_orders")}
          value={analyticsData?.orders?.pending?.toLocaleString() || "0"}
          icon={<TrendingUpIcon />}
          color="#DC3173"
        />
        <StatusCard
          title={t("completed_orders")}
          value={analyticsData?.orders?.completed?.toLocaleString() || "0"}
          icon={<CheckCircleIcon />}
          color="#DC3173"
        />
        <StatusCard
          title={t("cancelled_orders")}
          value={analyticsData?.orders?.cancelled?.toLocaleString() || "0"}
          icon={<XCircleIcon />}
          color="#DC3173"
        />
      </motion.div>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.6,
        }}
      >
        <div className="lg:col-span-2">
          <PopularCategories
            popularCategories={analyticsData?.popularCategories}
          />
        </div>
        <div>
          <RecentOrders recentOrders={analyticsData?.recentOrders} />
        </div>
      </motion.div>
      <motion.div
        className="mt-6"
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.8,
        }}
      >
        <TopProducts topRatedItems={analyticsData?.topRatedItems} />
      </motion.div>
    </div>
  );
};

export default Dashboard;
