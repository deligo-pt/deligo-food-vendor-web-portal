import { paymentMethods } from "@/src/consts/payment.const";
import { TTax } from "./tax.type";

export type TIngredient = {
  _id: string;
  sku: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  tax?: TTax;
  unit: "kg" | "g" | "litre" | "ml" | "piece" | "packet" | "box";
  stock: number;
  totalAddedQuantity?: number;
  lowStockAlert?: number;
  shelfLifeDays?: number;
  minOrder?: number;
  image: string;
  status: "available" | "unavailable" | string;
  isDeleted: boolean;
  bulkDiscount?: {
    minQty: number;
    discountPrice: number;
  }[];
  createdAt: string;
  updatedAt: string;
};

type TOrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED";
type TPaymentStatus = "PROCESSING" | "PAID";
type TPaymentMethod =
  | "CARD"
  | "MB_WAY"
  | "APPLE_PAY"
  | "PAYPAL"
  | "GOOGLE_PAY"
  | "OTHER";

export type TIngredientOrder = {
  _id: string;
  orderId: string;
  transactionId: string;

  grandTotal: number;
  isPaid: boolean;

  orderDetails: {
    ingredient: TIngredient;
    totalAmount: number;
    totalQuantity: number;
  };

  orderStatus: TOrderStatus;

  paymentMethod: TPaymentMethod;
  paymentStatus: TPaymentStatus;

  createdAt: string;
  updatedAt: string;
};

export type TIngredientPaymentIntentPayload = {
  orderDetails: [
    {
      ingredientId: string;
      quantity: number;
    }
  ];
  paymentMethod: (typeof paymentMethods)[number];
};

export type TIngredientOrderPayload = {
  orderId: string;
  paymentToken: string;
};
