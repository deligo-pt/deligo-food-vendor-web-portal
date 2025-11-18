import { TProduct } from "@/src/types/product.type";

export type TAnalytics = {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  mostOrderedCategory: string;
  topRatedProducts: TProduct[];
};
