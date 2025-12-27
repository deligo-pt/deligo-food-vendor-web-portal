"use client";

import DashboardHeader from "@/src/components/Dashboard/Dashboard/DashboardHeader";
import PopularCategories from "@/src/components/Dashboard/Dashboard/PopularCategories";
import RecentOrders from "@/src/components/Dashboard/Dashboard/RecentOrders";
import StatCard from "@/src/components/Dashboard/Dashboard/StatCard";
import StatusCard from "@/src/components/Dashboard/Dashboard/StatusCard";
import TopProducts from "@/src/components/Dashboard/Dashboard/TopProducts";
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
  return (
    <div className="max-w-7xl mx-auto">
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
          title="Total Items"
          value={analyticsData?.products?.total?.toLocaleString() || "0"}
          description="Total listed products"
          icon={<StoreIcon />}
          color="#DC3173"
        />
        <StatCard
          title="Active Products"
          value={analyticsData?.products?.active?.toLocaleString() || "0"}
          description="Items for sale"
          icon={<TruckIcon />}
          color="#DC3173"
        />
        <StatCard
          title="Inactive Products"
          value={analyticsData?.products?.inactive?.toLocaleString() || "0"}
          description="Items not for sale"
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
          title="Total Orders"
          value={analyticsData?.orders?.total?.toLocaleString() || "0"}
          icon={<ShoppingBagIcon />}
          color="#DC3173"
        />
        <StatusCard
          title="Pending"
          value={analyticsData?.orders?.pending?.toLocaleString() || "0"}
          icon={<TrendingUpIcon />}
          color="#DC3173"
        />
        <StatusCard
          title="Completed"
          value={analyticsData?.orders?.completed?.toLocaleString() || "0"}
          icon={<CheckCircleIcon />}
          color="#DC3173"
        />
        <StatusCard
          title="Cancelled"
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
