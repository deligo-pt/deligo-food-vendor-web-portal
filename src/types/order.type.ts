/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORDER_STATUS } from "@/src/consts/order.const";
import { TCustomer } from "@/src/types/customer.type";
import { TDeliveryPartner } from "@/src/types/delivery-partner.type";
import { TVendor } from "@/src/types/vendor.type";

export type TOrder = {
  _id: string;
  flash?: boolean;

  // Relationships
  orderId: string;
  customerId: TCustomer;
  vendorId: TVendor;
  deliveryPartnerId?: TDeliveryPartner; // assigned after vendor accepts

  // Items
  items: {
    productId: {
      name: {
        en: string;
        pt: string;
      };
      productId: string;
      _id: string;
    };
    quantity: number;
    price: number;
    subtotal: number;
    itemSummary?: {
      grandTotal: number;
      quantity: number;
    };
  }[];

  // Pricing & Payment
  totalItems: number;
  totalPrice: number;
  discount?: number;
  finalAmount: number;
  paymentMethod: "CARD" | "MOBILE";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

  // Order Lifecycle
  orderStatus: keyof typeof ORDER_STATUS;
  cancelReason?: string;

  remarks?: string;
  // OTP Verification
  deliveryOtp?: string; // generated when vendor accepts
  isOtpVerified?: boolean; // vendor verifies driver OTP

  // Address & Location
  deliveryAddress: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    gooAccuracy?: number;
  };

  pickupAddress?: {
    // vendor’s location
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    geoAccuracy?: number; // meters
  };

  // Price
  payoutSummary?: {
    grandTotal: number;
    vendor: {
      vendorNetPayout: number;
    };
    deliGoCommission: {
      totalDeduction: number;
    };
  };

  // Delivery Details
  deliveryCharge?: number;
  estimatedDeliveryTime?: string; // e.g., "30 mins"
  deliveredAt?: Date;

  // Status Tracking
  isPaid: boolean;
  isDeleted: boolean;

  // Ratings (optional, for later)
  rating?: {
    vendorRating?: number;
    deliveryRating?: number;
  };
  createdAt: Date;
  updatedAt: Date;
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
    contactNumber?: string; // may not always be present
    currentSessionLocation?: {
      type: string;
      coordinates: [number, number];
      geoAccuracy?: number;
      isMocked?: boolean;
      lastLocationUpdate?: string;
    };
  };
  vendorId: string; // just the ID in the current response
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