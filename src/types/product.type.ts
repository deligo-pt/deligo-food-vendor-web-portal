export type TVariations = {
  name: string;
  options: {
    label: string;
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
  name: string;
  slug: string;
  description: string;
  isDeleted: boolean;
  isApproved: boolean;
  remarks?: string;

  category: {
    _id: string;
    name: string;
  };
  subCategory?: string;
  brand?: string;

  pricing: {
    price: number;
    discount?: number;
    taxId?: string;
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

  tags?: string[];

  deliveryInfo?: {
    deliveryType: "Instant" | "Scheduled" | "Pickup";
    estimatedTime?: string;
    deliveryCharge?: number;
    freeDeliveryAbove?: number;
  };

  attributes?: Record<string, string | number | boolean | string[] | null>;

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
