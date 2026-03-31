import { paymentMethods } from "@/src/consts/payment.const";

export type TIngredient = {
  _id: string;
  ingredientId: string;

  name: string;
  category: string;
  description?: string;

  price: number;
  stock: number;
  minOrder?: number;

  image: string;

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
  orderDetails: {
    ingredient: string;
    totalQuantity: number;
  };
  paymentMethod: (typeof paymentMethods)[number];
};

export type TIngredientOrderPayload = {
  orderId: string;
  paymentToken: string;
};
