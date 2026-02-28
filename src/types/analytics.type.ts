import { ORDER_STATUS } from "@/src/consts/order.const";

export type TPopularCategory = {
  _id: string;
  name: string;
  percentage: number;
};

export type TRecentOrder = {
  _id: string;
  orderId: string;
  orderStatus: keyof typeof ORDER_STATUS;
  customerId: {
    name: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: Date;
};

export type TTopRatedItems = {
  _id: string;
  name: string;
  rating: {
    average: number;
  };
  images: string[];
  totalOrders: number;
};

export type TAnalytics = {
  products: {
    total: number;
    active: number;
    inactive: number;
  };

  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };

  popularCategories: TPopularCategory[];
  recentOrders: TRecentOrder[];
  topRatedItems: TTopRatedItems[];
};

export type TEarningsAnalytics = {
  topCard: {
    totalEarnings: string;
    orders: number;
    completed: number;
    pending: number;
  };
  earningsOverview: {
    today: string;
    thisWeek: string;
    thisMonth: string;
    totalIncome: string;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  monthlyEarnings: {
    name: string;
    earnings: string;
  };
};

type TWeeklyTrend = {
  day: string;
  total: number;
};

type TTOpSellingItem = {
  id: string;
  name: string;
  sold: number;
};

export type TSalesAnalytics = {
  totalSales: string;
  bestPerformingDay: string;
  slowestDay: string;
  weeklyTrend: TWeeklyTrend[];
  topSellingItems: TTOpSellingItem[];
};

type TDemographic = {
  name: string;
  value: number;
};

type TCustomerValueSegment = {
  segment: string;
  avgOrder: string;
};

type TOrderHeatmap = {
  day: number;
  hour: number;
  orderCount: number;
};

export type TCustomerInsights = {
  summaryCards: {
    totalCustomers: {
      value: number;
      subValue: string;
    };
    returningCustomers: {
      value: number;
      subValue: string;
    };
    topCity: {
      value: string;
      subValue: string;
    };
    retentionRate: {
      value: string;
      subValue: string;
    };
  };
  demographics: TDemographic[];
  customerValue: TCustomerValueSegment[];
  heatmap: TOrderHeatmap[];
};

type TDailyVolume = {
  day: string;
  orders: number;
};

type TPeakOrderingTime = {
  time: string;
  orderCount: number;
};

type TCategoryGrowth = {
  category: string;
  percentage: number;
};

export type TOrderTrends = {
  summary: {
    totalOrders: 10;
    percentage: "100%";
    trend: "up";
  };
  dailyVolume: TDailyVolume[];
  peakOrderingTimes: TPeakOrderingTime[];
  categoryGrowth: TCategoryGrowth[];
};

type TTopItem = {
  name: string;
  image: string;
  sold: number;
  rating: number;
  growthPercentage: number;
  trend: "up" | "down";
};

export type TTopPerformingItems = {
  summary: {
    totalItemsSold: number;
  };
  topItems: TTopItem[];
};
