/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORDER_STATUS, FULFILLMENT_TYPE } from "@/src/consts/order.const";
import { TCustomer } from "@/src/types/customer.type";
import { TDeliveryPartner } from "@/src/types/delivery-partner.type";
import { TVendor } from "@/src/types/vendor.type";

export type TOrder = {
  _id: string;
  flash?: boolean;

  // Relationships
  orderId: string;
  customerId: TCustomer;
  vendorId: TVendor | string;
  deliveryPartnerId?: TDeliveryPartner | null; // assigned after vendor accepts

  // Items
  items: {
    productId: string;
    vendorId: string;
    name: string;
    image?: string;
    hasVariations: boolean;
    variationSku?: string | null;
    addons: any[];
    productPricing: {
      originalPrice: number;
      productDiscountAmount: number;
      discountType: string;
      priceAfterProductDiscount: number;
      promoDiscountAmount: number;
      unitPrice: number;
      lineTotal: number;
      taxRate: number;
      taxAmount: number;
    };
    itemSummary: {
      quantity: number;
      totalTaxAmount: number;
      totalPromoDiscount: number;
      totalProductDiscount: number;
      grandTotal: number;
    };
    commission?: {
      deliGoCommissionRate: number;
      deliGoCommissionAmount: number;
      deliGoCommissionVatRate: number;
      deliGoCommissionVatAmount: number;
    };
    vendor?: {
      vendorEarningsWithoutTax: number;
      payableTax: number;
      vendorNetEarnings: number;
    };
  }[];

  totalItems: number;
  totalQuantity: number;

  // Pricing & Payment
  orderCalculation?: {
    totalOriginalPrice: number;
    totalProductDiscount: number;
    totalOfferDiscount: number;
    totalTaxAmount: number;
    itemsSubtotal: number;
    serviceCharge: number;
    serviceChargeVatRate: number;
    serviceChargeVatAmount: number;
  };
  delivery?: {
    charge: number;
    vatRate: number;
    vatAmount: number;
    totalDeliveryCharge: number;
    distance: number;
    estimatedTime: number;
    notes?: string;
  };
  payoutSummary?: {
    grandTotal: number;
    deliGoCommission: {
      rate: number;
      amount: number;
      vatAmount: number;
      totalDeduction: number;
      earnedServiceCharge: number;
      serviceChargeVatAmount: number;
      deliveryVatAmount: number;
      totalPlatformNetRevenue: number;
      totalPlatformPayableTax: number;
      totalPlatformGrossHolding: number;
    };
    fleet: {
      rate: number;
      fee: number;
    };
    vendor: {
      earningsWithoutTax: number;
      payableTax: number;
      vendorNetPayout: number;
    };
    rider: {
      riderNetEarnings: number;
    };
  };
  paymentMethod: "CARD" | "MOBILE" | string;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "PAID" | string;
  transactionId?: string;
  isPaid: boolean;

  // Order Lifecycle
  orderStatus: keyof typeof ORDER_STATUS | string;
  fulfillmentType?: keyof typeof FULFILLMENT_TYPE | string;
  cancelReason?: string;
  deliveryPartnerCancelReason?: string | null;
  remarks?: string;

  // OTP Verification
  deliveryOtp?: string;
  isOtpVerified?: boolean;

  // Address & Location
  deliveryAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    geoAccuracy?: number;
    detailedAddress?: string;
  };

  pickupAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    geoAccuracy?: number | null;
    detailedAddress?: string;
  };

  pickup?: {
    generatedAt?: string;          // ISO date string
    verifiedAt?: string;           // ISO date string
    verifiedBy?: string;           // vendor / user id
    readyAt?: string;              // ISO date string
    pickupTime?: string;           // e.g. "2026-08-10T21:20:00.000Z"
    pickupSlotEndTime?: string;    // e.g. "2026-08-10T21:50:00.000Z"
  }
  // Delivery Details
  deliveryCharge?: number;
  estimatedDeliveryTime?: string;
  deliveredAt?: Date | string;
  preparationTime?: number;
  preparingApprovedAt?: string | null;
  canStartPreparing?: boolean;
  dispatchPartnerPool?: any[];

  // Status Tracking
  statusHistory?: {
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string | null;
  }[];
  refundStatus?: string;
  isDeleted: boolean;

  // Ratings
  ratingStatus?: {
    isProductRated: boolean;
    isVendorRated: boolean;
    isDeliveryRated: boolean;
  };
  isRated?: boolean;
  rating?: {
    vendorRating?: number;
    deliveryRating?: number;
  };

  // Invoice
  invoiceSync?: {
    isSynced: boolean;
    syncedAt?: string;
    syncError?: string;
  };

  offer?: {
    isApplied: boolean;
    offerApplied: any | null;
  };

  createdAt: Date | string;
  updatedAt: Date | string;
  __v?: number;
};

export type TOrderDetails = {
  _id: string;
  orderId: string;
  flash?: boolean;

  // Relationships
  customerId: {
    _id: string;
    userId: string;
    role: string;
    name: {
      firstName: string;
      lastName: string;
    };
    profilePhoto?: string;
    NIF?: string;
    contactNumber?: string;
    currentSessionLocation?: {
      type: string;
      coordinates: [number, number];
      geoAccuracy?: number;
      isMocked?: boolean;
      lastLocationUpdate?: string;
    };
  };
  vendorId: string;
  deliveryPartnerId?: {
    _id: string;
    name?: {
      firstName: string;
      lastName: string;
    };
    profilePhoto?: string;
    contactNumber?: string;
  } | null;
  deliveryPartnerCancelReason?: string | null;

  // Fulfillment
  fulfillmentType?: string; // e.g. "DELIVERY"

  // Items
  items: {
    productId: string;
    vendorId: string;
    name: string;
    image?: string;
    hasVariations: boolean;
    variationSku?: string | null;
    addons: any[];
    productPricing: {
      originalPrice: number;
      productDiscountAmount: number;
      discountType: string;
      priceAfterProductDiscount: number;
      promoDiscountAmount: number;
      unitPrice: number;
      lineTotal: number;
      taxRate: number;
      taxAmount: number;
    };
    itemSummary: {
      quantity: number;
      totalTaxAmount: number;
      totalPromoDiscount: number;
      totalProductDiscount: number;
      grandTotal: number;
    };
    commission?: {
      deliGoCommissionRate: number;
      deliGoCommissionAmount: number;
      deliGoCommissionVatRate: number;
      deliGoCommissionVatAmount: number;
    };
    vendor?: {
      vendorEarningsWithoutTax: number;
      payableTax: number;
      vendorNetEarnings: number;
    };
  }[];

  totalItems: number;
  totalQuantity: number;

  // Pricing
  orderCalculation: {
    totalOriginalPrice: number;
    totalProductDiscount: number;
    totalOfferDiscount: number;
    totalTaxAmount: number;
    itemsSubtotal: number;
    serviceCharge: number;
    serviceChargeVatRate: number;
    serviceChargeVatAmount: number;
  };

  delivery: {
    charge: number;
    vatRate: number;
    vatAmount: number;
    totalDeliveryCharge: number;
    distance: number;
    estimatedTime: number;
    notes?: string;
  };

  payoutSummary: {
    grandTotal: number;
    deliGoCommission: {
      rate: number;
      amount: number;
      vatAmount: number;
      totalDeduction: number;
      earnedServiceCharge: number;
      serviceChargeVatAmount: number;
      deliveryVatAmount: number;
      totalPlatformNetRevenue: number;
      totalPlatformPayableTax: number;
      totalPlatformGrossHolding: number;
    };
    fleet: {
      rate: number;
      fee: number;
    };
    vendor: {
      earningsWithoutTax: number;
      payableTax: number;
      vendorNetPayout: number;
    };
    rider: {
      riderNetEarnings: number;
    };
  };

  offer: {
    isApplied: boolean;
    offerApplied: any | null;
  };

  // Payment
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  isPaid: boolean;

  // Status
  orderStatus: keyof typeof ORDER_STATUS | string;
  statusHistory: {
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string | null;
  }[];
  refundStatus: string;
  remarks?: string;
  preparingApprovedAt?: string | null;
  canStartPreparing?: boolean;
  dispatchPartnerPool?: any[];

  // Addresses
  deliveryAddress: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    longitude?: number;
    latitude?: number;
    geoAccuracy?: number;
    detailedAddress?: string;
  };

  pickupAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    longitude?: number;
    latitude?: number;
    geoAccuracy?: number | null;
    detailedAddress?: string;
  };
  pickup?: {
    generatedAt?: string;          // ISO date string
    verifiedAt?: string;           // ISO date string
    verifiedBy?: string;           // vendor / user id
    readyAt?: string;              // ISO date string
    pickupTime?: string;           // e.g. "2026-08-10T21:20:00.000Z"
    pickupSlotEndTime?: string;    // e.g. "2026-08-10T21:50:00.000Z"
  }

  preparationTime?: number;
  ratingStatus?: {
    isProductRated: boolean;
    isVendorRated: boolean;
    isDeliveryRated: boolean;
  };
  isRated?: boolean;

  invoiceSync?: {
    isSynced: boolean;
    syncedAt?: string;
    syncError?: string;
  };

  isDeleted: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
};