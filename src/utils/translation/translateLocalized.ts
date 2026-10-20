import { translateObject } from "./translationObject";
import {
  keepFilled,
  type FormLang,
  type LocalizedText,
} from "../formLanguage";

/**
 * Fill the missing language of each `{ en, pt }` text by translation — safely.
 *
 * Replaces a bare `translateObject(fields, lang)`, which always translated from
 * the language on screen, even when that field was empty, and wrote the result
 * over the other language. `translateObject` now translates each text from the
 * language that actually holds it (the `translationSource` rule), and an empty
 * translation never overwrites typed text (`keepFilled`). See
 * `formLanguage.ts` for the bug this closes.
 *
 * One call, so a failed translation opens the translation dialog once.
 * Resolves `null` when the vendor cancels it.
 */
export async function translateLocalizedFields<K extends string>(
  fields: Record<K, LocalizedText>,
  lang: FormLang,
): Promise<Record<K, LocalizedText> | null> {
  const batch = Object.fromEntries(
    (Object.keys(fields) as K[]).map((key) => [
      key,
      { en: fields[key]?.en ?? "", pt: fields[key]?.pt ?? "" },
    ]),
  ) as Record<K, { en: string; pt: string }>;

  const translated = await translateObject(batch, lang);
  if (!translated) return null;

  const result = { ...fields };
  for (const key of Object.keys(fields) as K[]) {
    result[key] = keepFilled(fields[key], translated[key]);
  }

  return result;
}
