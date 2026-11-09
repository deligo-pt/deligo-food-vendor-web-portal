import { LocalizedType } from ".";

/**
 * `BUY_AND_REWARD` is what the API sends and takes. `BOGO` (and `bogo`) is the
 * older name still read by `ActiveOffers`; kept until that card is rewritten.
 */
export type TOfferType = "PERCENT" | "FLAT" | "BUY_AND_REWARD" | "BOGO";

export type TFirstOrderScope = "VENDOR" | "GLOBAL";

/**
 * A First-Order Offer is an ordinary offer whose `eligibility.type` is
 * `"FIRST_ORDER"` (`first-order-offers.md`). A store always sends
 * `scope: "VENDOR"`; `GLOBAL` is admin-only and answers
 * `403 FIRST_ORDER_OFFER_ADMIN_ONLY`. The scope cannot change after creation.
 */
export type TOfferEligibility = {
  type: "FIRST_ORDER";
  scope: TFirstOrderScope;
  /** Default `true`: the customer's phone must be verified. */
  requireVerifiedPhone?: boolean;
  /** 0–5, default 2: how often a stopped order gives the offer back. */
  maxRestores?: number;
};

export type TOfferRewardOption = {
  productId: string;
  variationSku?: string;
};

export type TBuyAndReward = {
  buy: {
    scope: "SPECIFIC_PRODUCTS" | "CATEGORIES";
    productIds?: string[];
    categoryIds?: string[];
    quantity: number;
  };
  reward: {
    type: "SAME_PRODUCT" | "FIXED_PRODUCT" | "CUSTOMER_CHOICE";
    quantity: number;
    productId?: string;
    variationSku?: string;
    options?: TOfferRewardOption[];
  };
};

export type TOfferCreatorRole = "VENDOR" | "SUB_VENDOR" | "ADMIN" | "SUPER_ADMIN";

export type TOffer = {
  _id: string;
  title: LocalizedType;
  description: LocalizedType;
  // Offer type
  offerType: TOfferType;
  // Discount values
  discountValue?: number;
  /** Required and > 0 for PERCENT offers (create and update). */
  maxDiscountAmount?: number;

  /** @deprecated older shape; the API now sends `buyAndReward`. */
  bogo?: {
    buyQty: number;
    getQty: number;
    buyProductId: string;
    getProductId?: string;
  };
  buyAndReward?: TBuyAndReward;

  // Validity period
  validFrom: Date;
  expiresAt: Date;

  // Eligibility
  /** An id when sent, the populated store on list/detail responses. */
  vendorId?: string | { _id: string; userId?: string } | null;
  /** FLAT offers need at least 2× `discountValue`. */
  minOrderAmount?: number;
  /** Present only on First-Order Offers. */
  eligibility?: TOfferEligibility | null;

  // What the discount applies to
  scopeType?: "ALL_PRODUCTS" | "SPECIFIC_PRODUCTS" | "CATEGORIES";
  scopeProducts?: string[];
  scopeCategories?: string[];
  /** Default `false`: already-discounted products are left out of the base. */
  allowDiscountedProducts?: boolean;

  // Auto apply or manual code (optional)
  isAutoApply: boolean;
  code?: string; // if offer requires a code (optional)

  // Applicable products (optional, if empty or not provided, applies to all products)
  applicableProducts?: unknown[];

  // Usage control
  /** Not allowed on First-Order Offers. */
  maxUsageCount?: number;
  usageCount?: number;
  /** Forced to 1 by the backend on First-Order Offers. */
  userUsageLimit?: number;

  // Funding — set by the backend, never sent.
  fundedBy?: "VENDOR" | "PLATFORM";
  vendorSharePercent?: number;

  /** Who made it; an offer an admin made for the store is locked for the vendor. */
  createdByRole?: TOfferCreatorRole;

  isGlobal: boolean;

  // Status
  isActive: boolean;
  isDeleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};

/** True for a First-Order (welcome) offer. */
export function isFirstOrderOffer(
  offer: Pick<TOffer, "eligibility"> | null | undefined,
): boolean {
  return offer?.eligibility?.type === "FIRST_ORDER";
}

/** True when DeliGo set this offer up for the store, so the vendor can't edit it. */
export function isAdminCreatedOffer(
  offer: Pick<TOffer, "createdByRole"> | null | undefined,
): boolean {
  return offer?.createdByRole === "ADMIN" || offer?.createdByRole === "SUPER_ADMIN";
}

/** Backend defaults for a store's First-Order Offer (`first-order-offers.md` §4.1). */
export const FIRST_ORDER_DEFAULTS = {
  requireVerifiedPhone: true,
  maxRestores: 2,
  maxRestoresLimit: 5,
} as const;
