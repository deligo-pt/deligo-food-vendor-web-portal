import { TTax } from "@/src/types/tax.type";

/**
 * Portugal's standard rate, as `/taxes` codes it.
 *
 * The four codes are the Portuguese VAT bands: NOR (normal, 23%), INT
 * (intermédia, 13%), RED (reduzida, 6%) and ISE (isenta, 0%). The code is what
 * identifies the band; the rate is what the band currently happens to be, and
 * rates move — 23% has been 17%, 19%, 20% and 21% within living memory.
 */
export const STANDARD_VAT_CODE = "NOR";

/** What that band charges today. A fallback for a record with no code. */
export const STANDARD_VAT_RATE = 23;

/**
 * The tax a new product starts on, as an id the form can submit.
 *
 * Standard VAT is what almost every restaurant item carries, and the backend
 * already treats it as the default — so the field arriving empty made every
 * vendor re-pick a value that was never in question.
 *
 * Matched against the list `/taxes` returned rather than hardcoded: an id
 * written into the source would submit a tax that does not exist the moment the
 * backend reseeds, and would do it silently, since the form only ever sends an
 * id. Codes are checked before rates for the reason above.
 *
 * Returns `""` when the list has no standard band at all — the field then
 * behaves exactly as it did before, empty and waiting, rather than defaulting
 * to whatever happens to be first and taxing a product at 6% by accident.
 */
export function standardVatTaxId(taxes: TTax[] | undefined | null): string {
  const usable = (taxes ?? []).filter(
    (tax) => tax && tax.isActive !== false && !tax.isDeleted,
  );

  const byCode = usable.find((tax) => tax.taxCode === STANDARD_VAT_CODE);
  if (byCode) return byCode._id;

  return usable.find((tax) => tax.taxRate === STANDARD_VAT_RATE)?._id ?? "";
}
