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
