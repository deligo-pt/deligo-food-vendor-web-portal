/**
 * Variation Management, counted over the whole catalogue (8 Oct 2026).
 *
 * The page lists 10 products a page, newest first, and the "Variations" and
 * "Options" boxes used to add up only those 10. Tasca do Bairro had 184
 * products, two of them with variations, both on page 19: the page said
 * "Variations: 0". The counts now come from every product, and a filter shows
 * only the products that have (or don't have) variations.
 *
 * No imports, so it can be checked on its own.
 */

/** `?variations=` on the page. */
export type TVariationsFilter = "with" | "without" | "";

export function variationsFilter(value: unknown): TVariationsFilter {
  return value === "with" || value === "without" ? value : "";
}

type WithVariations = {
  variations?: ({ options?: unknown[] | null } | null)[] | null;
};

export function hasVariations(product: WithVariations | null | undefined): boolean {
  return (product?.variations?.length ?? 0) > 0;
}

export type TVariationSummary = {
  products: number;
  /** Products with at least one variation. */
  withVariations: number;
  variations: number;
  options: number;
};

export function summarizeVariations(products: readonly (WithVariations | null | undefined)[]): TVariationSummary {
  const summary: TVariationSummary = { products: products.length, withVariations: 0, variations: 0, options: 0 };
  for (const product of products) {
    const variations = product?.variations ?? [];
    if (variations.length > 0) summary.withVariations++;
    summary.variations += variations.length;
    for (const variation of variations) summary.options += variation?.options?.length ?? 0;
  }
  return summary;
}

export function matchesVariationsFilter(product: WithVariations | null | undefined, filter: TVariationsFilter): boolean {
  if (filter === "with") return hasVariations(product);
  if (filter === "without") return !hasVariations(product);
  return true;
}
