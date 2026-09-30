// `import type` so `pnpm verify:offer-products` can load this module under bare
// Node (`--experimental-strip-types`): no bundler, so no `@/` value imports.
import type { TProduct } from "@/src/types/product.type";

/**
 * Which products an offer's product pickers may show.
 *
 * No React and no network, so every rule here can be checked on its own.
 *
 * ## The bug
 *
 * Create Offer listed **every** product the vendor has, inactive ones included
 * — measured 30 Sep 2026 on Tasca do Bairro: 13 products, and "Chicken Soup"
 * (`meta.status: "INACTIVE"`) sat under DESSERT ready to be put on offer. A
 * customer cannot buy an inactive product, so an offer on it discounts nothing
 * and a buy-X-get-Y reward built on it can never be claimed.
 *
 * Active is `meta.status === "ACTIVE"`. The product has no top-level
 * `isActive`; `meta.status` is what the product form writes and what the
 * product card shows.
 *
 * ## Create and edit differ, on purpose
 *
 * - **Create** asks the API for active products only
 *   (`GET /products?meta.status=ACTIVE` → 12 of the 13, measured), the same
 *   filter the price increase/decrease pages already send.
 * - **Edit** must also keep the products **the offer already holds**. A product
 *   switched off after the offer was made is still in the offer; hiding it
 *   would make it impossible to see or untick, and the form would carry an
 *   invisible id into the next save. It stays listed, marked inactive, so the
 *   vendor can take it out.
 */

/** The query that keeps inactive products out of a picker's catalogue. */
export const ACTIVE_PRODUCTS_QUERY = { "meta.status": "ACTIVE" } as const;

/** Whether a customer can buy this product at all. */
export function isActiveProduct(product: Pick<TProduct, "meta" | "isDeleted"> | null | undefined): boolean {
  return product?.meta?.status === "ACTIVE" && !product?.isDeleted;
}

/**
 * Every product id an existing offer refers to — its specific-products scope,
 * the products to buy, the reward product and the reward options. These must
 * stay visible in the edit form whatever their status now.
 */
export function offerProductIds(offer: unknown): string[] {
  const o = (offer ?? {}) as {
    scopeProducts?: unknown;
    applicableProducts?: unknown;
    buyAndReward?: {
      buy?: { productIds?: unknown };
      reward?: { productId?: unknown; options?: { productId?: unknown }[] };
    };
  };
  const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
  const ids = [
    ...list(o.scopeProducts),
    ...list(o.applicableProducts),
    ...list(o.buyAndReward?.buy?.productIds),
    o.buyAndReward?.reward?.productId,
    ...list(o.buyAndReward?.reward?.options).map((opt) => (opt as { productId?: unknown })?.productId),
  ];
  return [...new Set(ids.filter((id): id is string => typeof id === "string" && id !== ""))];
}

/**
 * The picker's catalogue: active products, plus any inactive one in `keepIds`
 * (the offer's own products, when editing). Order is the API's.
 */
export function offerPickerProducts<P extends Pick<TProduct, "meta" | "isDeleted"> & { _id?: string }>(
  products: P[] | null | undefined,
  keepIds: readonly string[] = [],
): P[] {
  const keep = new Set(keepIds);
  return (products ?? []).filter(
    (p) => isActiveProduct(p) || (!!p._id && keep.has(p._id)),
  );
}
