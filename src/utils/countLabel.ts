/**
 * "1 product selected" / "3 products selected" in the current language.
 *
 * The portal's `t()` has no interpolation, so the plural key carries a
 * `{count}` placeholder that is filled here. Two keys rather than one because
 * Portuguese agrees the adjective too ("selecionado" / "selecionados").
 */
export function countLabel(
  t: (key: string) => string,
  count: number,
  oneKey: string,
  manyKey: string,
): string {
  return count === 1 ? t(oneKey) : t(manyKey).replace("{count}", String(count));
}
