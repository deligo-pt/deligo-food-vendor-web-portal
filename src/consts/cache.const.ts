/**
 * Server-side caching of data that rarely changes (Next's fetch Data Cache).
 *
 * Every all-items search, filter or page change used to fetch categories,
 * branches and the vendor's profile again, although only the products had
 * changed. These lists now come from the cache.
 *
 * ## Who sees what
 *
 * Next keys each cached fetch on its URL **and headers**. Our requests carry the
 * vendor's `Authorization` and `Accept-Language`, so each entry belongs to one
 * session and one language. Another vendor never sees it, and EN never serves
 * PT. Only `200` responses are stored, so a 403, 404 or 429 is never cached.
 *
 * ## After an edit
 *
 * Every server action that changes one of these lists calls `updateTag(tag)`.
 * That expires the entry immediately, so the vendor's next page shows the
 * change. `revalidateTag(tag, {})`, used before, is stale-while-revalidate: the
 * next page would still show the old list. Changes made elsewhere (admin panel,
 * another device) appear within the `revalidate` window below.
 *
 * Kept out of the `"use server"` service files, which may only export async
 * functions.
 */
export const CACHE_TAGS = {
  productCategories: "product-categories",
  branches: "branches",
  profile: "profile",
} as const;

/** Seconds a cached entry is reused before it's fetched again. */
export const CACHE_SECONDS = {
  /** Category list and the branch list used as copy targets. */
  lists: 300,
  /** The signed-in vendor's own record (`/profile`, or `/vendors/:id` for a branch). */
  profile: 60,
} as const;
