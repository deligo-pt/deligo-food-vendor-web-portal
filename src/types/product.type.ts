import { LocalizedType } from ".";

export type TVariations = {
  name: LocalizedType;
  options: {
    label: LocalizedType;
    price: number;
    stockQuantity: number;
    sku: string;
    isOutOfStock: boolean;
    totalAddedQuantity: number;
  }[];
};

export type TProduct = {
  _id: string;
  productId: string;
  sku: string;
  name: LocalizedType;
  slug: string;
  description: LocalizedType;
  isDeleted: boolean;
  isApproved: boolean;
  remarks?: string;

  category: {
    _id: string;
    name: LocalizedType;
  };
  additionalCategories?: {
    _id: string;
    name: LocalizedType;
  }[];
  subCategory?: string;
  // brand?: string;

  pricing: {
    price: number;
    discountType: "PERCENTAGE" | "FLAT";
    discount?: number;
    taxId?: string;
    taxAmount?: number;
    taxRate?: number;
    finalPrice: number;
    currency: string;
  };

  variations: TVariations[];
  addonGroups: string[];

  stock: {
    quantity: number;
    unit: string;
    availabilityStatus: "In Stock" | "Out of Stock" | "Limited";
    hasVariations: boolean;
  };

  images: string[];

  vendor: {
    vendorId: string;
    vendorName: string;
    vendorType: string;
    rating?: number;
  };

  // tags?: string[];

  deliveryInfo?: {
    deliveryType: "Instant" | "Scheduled" | "Pickup";
    estimatedTime?: string;
    deliveryCharge?: number;
    freeDeliveryAbove?: number;
  };

  // attributes?: Record<string, string | number | boolean | string[] | null>;

  rating?: {
    average: number;
    totalReviews: number;
  };

  meta: {
    isFeatured?: boolean;
    isAvailableForPreOrder?: boolean;
    status: "ACTIVE" | "INACTIVE";
    origin?: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type TProductsQueryParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  searchTerm?: string;
  "stock.availabilityStatus"?: string;
  category?: string;
};

/** What the vendor picked, before it becomes a request body. */
export type TCopyProductsInput = {
  /** `PROD-XXXXXX` codes — the only product id `/products/copy-to-sub-vendors` resolves. */
  productIds: string[];
  /** A branch's Mongo `_id` or its `SV-…` userId; both are accepted. */
  targetSubVendorIds: string[];
  /** Every product this vendor owns, not just the ones on the current page. */
  copyAllProducts?: boolean;
  /** Every approved branch. */
  copyToAllTargetSubVendors?: boolean;
};

/** The request body. The two exclusive pairs can never both be present. */
export type TCopyProductsPayload = {
  copyAllProducts: boolean;
  productIds?: string[];
  targetSubVendorIds?: string[];
  copyToAllTargetSubVendors?: boolean;
};

/** The `data` block of a successful copy. `copiedCount: 0` is still a 200. */
export type TProductCopyResult = {
  copiedCount: number;
  targetCount: number;
  copiedProductIds: string[];
  /** Echoed as userIds whichever id shape was sent. */
  copiedTargetSubVendorUserIds: string[];
  copiedCategoryCount: number;
  copiedAddonGroupCount: number;
};

/** The result, reduced to the line the customer reads. */
export type TProductCopySummary = {
  tone: "success" | "partial" | "info";
  key: "copy_done" | "copy_partial" | "copy_nothing_new";
  copied: number;
  targets: number;
  requestedProductCount: number;
};
