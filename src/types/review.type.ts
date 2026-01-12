import { TCustomer } from "@/src/types/customer.type";

export type TReviewType = "DELIVERY_PARTNER" | "PRODUCT" | "VENDOR";

export type TRefModel = "Customer" | "Vendor" | "DeliveryPartner" | "Product";

export type TSubReviews = {
  foodQuality?: number;
  packaging?: number;
  deliverySpeed?: number;
  riderBehavior?: number;
};

export type TReviewSentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export type TReview = {
  _id: string;
  ratingType: TReviewType;
  rating: number;
  sentiment: TReviewSentiment;
  review: string;

  reviewerId: TCustomer;
  reviewerModel: TRefModel;

  targetId: { name: string; _id: string };
  targetModel: TRefModel;

  orderId: string;
  productId: string;

  subRatings: TSubReviews;

  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};
