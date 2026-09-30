import { translateObject } from "./translationObject";
import {
  keepFilled,
  translationSource,
  type FormLang,
  type LocalizedText,
} from "../formLanguage";

/**
 * Fill the missing language of each `{ en, pt }` text by translation — safely.
 *
 * Replaces a bare `translateObject(fields, lang)`, which always translated from
 * the language on screen, even when that field was empty, and wrote the result
 * over the other language. Here each text is translated from the language that
 * actually holds it (`translationSource`), texts sharing a source go in one
 * request, and an empty translation never overwrites typed text
 * (`keepFilled`). See `formLanguage.ts` for the bug this closes.
 */
export async function translateLocalizedFields<K extends string>(
  fields: Record<K, LocalizedText>,
  lang: FormLang,
): Promise<Record<K, LocalizedText>> {
  const result = { ...fields };
  const bySource: Record<FormLang, K[]> = { en: [], pt: [] };

  for (const key of Object.keys(fields) as K[]) {
    const value = fields[key];
    const source = translationSource(value, lang);
    if (value?.[source]?.trim()) bySource[source].push(key);
  }

  for (const source of ["en", "pt"] as const) {
    const keys = bySource[source];
    if (!keys.length) continue;
    const batch = Object.fromEntries(
      keys.map((key) => [key, { en: fields[key].en ?? "", pt: fields[key].pt ?? "" }]),
    ) as Record<K, { en: string; pt: string }>;
    const translated = await translateObject(batch, source);
    for (const key of keys) {
      result[key] = keepFilled(fields[key], translated?.[key]);
    }
  }

  return result;
}
