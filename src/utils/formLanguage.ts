/**
 * How a bilingual form behaves when the portal's language changes under it.
 *
 * No React, no network, no `@/` value imports, so `pnpm verify:offer-language`
 * can run every rule here under bare Node.
 *
 * ## The bug (30 Sep 2026, Create Offer)
 *
 * The form shows ONE field per text — `title.pt` in Portuguese, `title.en` in
 * English — and recorded the language once, on mount (`currentLang: lang`).
 * Switching language (the topbar, or a `?lang=pt` link over a stored "en")
 * left the two disagreeing:
 *
 * - **Dead button.** Opened as "en", shown as "pt", typed into `title.pt`: the
 *   check still demanded `title.en`, whose field — and error message — was not
 *   on screen. The submit was blocked with nothing visible.
 * - **"title.en é obrigatório".** Typed into `title.en`, switched to PT (empty
 *   field), submitted: the check passed on `title.en`, then the submit
 *   translated the EMPTY `title.pt` and wrote "" over the English the vendor
 *   had typed. The API refused it.
 *
 * The rules below close both: the form follows the page's language, what was
 * typed follows the vendor across a switch, and a translation never replaces
 * a filled text with nothing.
 */

export type FormLang = "en" | "pt";
export type LocalizedText = { en?: string; pt?: string };

export const otherLang = (lang: FormLang): FormLang => (lang === "en" ? "pt" : "en");

const filled = (value: string | undefined | null): boolean => !!value && value.trim() !== "";

/**
 * The text as it should read after switching `from` → `to`: if the field now
 * on screen is empty and the one just hidden holds text, that text moves
 * across, so the vendor sees what they typed instead of an empty box. A field
 * that already has its own text — an existing offer's translation — is left
 * alone.
 */
export function carryOverText(
  value: LocalizedText | null | undefined,
  from: FormLang,
  to: FormLang,
): LocalizedText {
  const text: LocalizedText = { en: value?.en ?? "", pt: value?.pt ?? "" };
  if (from === to || filled(text[to]) || !filled(text[from])) return text;
  return { ...text, [to]: text[from] };
}

/**
 * Which language to translate FROM: the one on screen when it has text,
 * otherwise the other one if that does. Never an empty source when a filled
 * one exists — that is what produced "title.en é obrigatório".
 */
export function translationSource(value: LocalizedText | null | undefined, lang: FormLang): FormLang {
  if (filled(value?.[lang])) return lang;
  const other = otherLang(lang);
  return filled(value?.[other]) ? other : lang;
}

/**
 * The translated text, except that an empty result never replaces a filled
 * original. A translator hiccup then costs one language's freshness, not the
 * text the vendor typed.
 */
export function keepFilled(original: LocalizedText, translated: LocalizedText | null | undefined): LocalizedText {
  return {
    en: filled(translated?.en) ? translated!.en : original.en ?? "",
    pt: filled(translated?.pt) ? translated!.pt : original.pt ?? "",
  };
}
