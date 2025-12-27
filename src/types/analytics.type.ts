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
