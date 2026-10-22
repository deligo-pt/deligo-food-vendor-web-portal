/**
 * All Items, loaded a category at a time (6 Oct 2026).
 *
 * The page used to ask for the first 20 products and stop, so a vendor with 184
 * saw 20, with no way to reach the rest. Now the category box lists every
 * category with its count, and each category's products load 12 at a time as
 * the vendor scrolls to them (`GET /products?category=<id>&page=N`). A product
 * whose additional category is X is listed under X too; the API already
 * includes those.
 *
 * Products filed under no category of the vendor's own end up in a last
 * "Other" section, found by a scan once the vendor scrolls there. The API can't
 * filter "none of mine".
 *
 * No imports, so `pnpm verify:all-items` runs these directly.
 */

/** Products per request. Twelve fills the grid's 3, 2 and 1 columns evenly. */
export const CATALOGUE_PAGE_SIZE = 12;

/** The id of the trailing section for products in none of the vendor's categories. */
export const OTHER_SECTION_ID = "uncategorized";

export type TCatalogueFilters = {
  searchTerm?: string;
  sortBy?: string;
  /** `stock.availabilityStatus`, when the vendor filtered by it. */
  availability?: string;
  /** Only products carrying the SDR container deposit. */
  sdrOnly?: boolean;
  lang?: string;
};

/** The query every products request on this page carries, filters included. */
export function catalogueQuery(
  filters: TCatalogueFilters,
  extra: Record<string, string | number>,
): Record<string, string | number> {
  return {
    ...extra,
    ...(filters.sortBy ? { sortBy: filters.sortBy } : {}),
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
    ...(filters.availability ? { "stock.availabilityStatus": filters.availability } : {}),
    // Checked live (16 Oct 2026): `sdr.applicable=true` returns exactly the
    // flagged products. `=false` does not return the rest, so only "true" is
    // ever sent.
    ...(filters.sdrOnly ? { "sdr.applicable": "true" } : {}),
  };
}

type Named = { _id: string; name?: unknown };

/** A `{ en, pt }` field (or a plain string) as `lang` reads it. */
export function localizedText(value: unknown, lang: string): string {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";
  const bag = value as Record<string, unknown>;
  for (const key of [lang, "en", "pt"]) {
    const found = bag[key];
    if (typeof found === "string" && found.trim()) return found.trim();
  }
  return "";
}

/**
 * Every category, in the vendor's own order: the order the API lists them in
 * (`displayOrder`, set on the Product Categories page with "Arrange order"),
 * which is also the order customers see. Was A–Z until 22 Oct 2026. Counts
 * aren't known yet: each category's count arrives with its first page, as the
 * vendor scrolls to it (the box shows "–", then a spinner, then the number).
 */
export function orderCategories<C extends Named>(categories: readonly C[]): C[] {
  return [...categories];
}

type Placed = {
  category?: { _id?: string | null } | null;
  additionalCategories?: ({ _id?: string | null } | null)[] | null;
};

/** In none of the vendor's own categories, main or additional: it belongs in "Other". */
export function isOrphan(product: Placed, ownedIds: ReadonlySet<string>): boolean {
  if (product.category?._id && ownedIds.has(product.category._id)) return false;
  return !(product.additionalCategories ?? []).some((extra) => extra?._id && ownedIds.has(extra._id));
}

/**
 * A section's products after another page arrives: in order, each product
 * once. A product can shift pages between two requests (one was added or
 * deleted meanwhile), and without this it would show twice.
 */
export function appendPage<P extends { _id?: string }>(loaded: readonly P[], incoming: readonly P[]): P[] {
  const seen = new Set(loaded.map((product) => product._id));
  return [...loaded, ...incoming.filter((product) => !seen.has(product._id))];
}

/**
 * Whether a section has more to load. `total` is `null` until the section's
 * first page has said how many there are, and an unknown section has more.
 */
export function hasMore(loaded: number, total: number | null): boolean {
  return total === null || loaded < total;
}
