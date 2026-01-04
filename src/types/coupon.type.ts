export type TCoupon = {
  _id?: string;
  code: string;
  discountType: "PERCENT" | "FLAT";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount?: number;
  validFrom?: Date;
  expiresAt?: Date;
  applicableCategories?: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TopItemsInfluenced = {
  name: string;
  quantity: number;
};

export type MonthlyAnalysis = {
  month: string;
  usage: number;
  revenue: number;
};

export type TCouponAnalytics = {
  couponCode: string;
  totalCustomerUsage: number;
  revenueImpact: number;
  topItemsInfluenced: TopItemsInfluenced[];
  monthlyAnalysis: MonthlyAnalysis[];
};
