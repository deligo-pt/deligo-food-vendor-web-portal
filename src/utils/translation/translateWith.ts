import type {
    Language,
    TranslationErrorCode,
    TranslationUpdate,
} from "@/src/types/translation.type";
import { extractFields } from "./extractFields.ts";
import { applyTranslations } from "./applyTranslations.ts";

/**
 * How a form's `{ en, pt }` texts get their other language — and what happens
 * when they can't.
 *
 * No React, no network, no `@/` value imports: the request goes through
 * `send`, so `pnpm verify:translation` runs every rule here under bare Node.
 *
 * ## The outage (20 Oct 2026)
 *
 * DeepL answered 456 "Quota exceeded" to every call. `translateObject` threw,
 * and none of the forms that called it without a try/catch closed their
 * loading toast: "Adding category..." spun forever and nothing was saved.
 *
 * The rules now:
 *
 * - **Never throws.** A failed translation comes back as `review`: the texts
 *   the vendor must decide about (the translation dialog asks them). The
 *   `result` is already safe to save — an empty other language holds a copy
 *   of what was typed, a filled one is kept — for when no dialog can ask.
 * - **Translates from the side that has text.** A field typed in English and
 *   submitted with the portal in Portuguese is translated EN → PT, instead
 *   of sending "" and writing the blank over the English.
 * - **Sends nothing it doesn't need to.** Fields with no text on either side
 *   are skipped; no request at all when there is nothing to translate.
 */

export type DeepLLang = "EN" | "PT";

export type TranslationRequest = {
    texts: string[];
    sourceLang: DeepLLang;
    targetLang: DeepLLang;
};

export type TranslationReply =
    | { ok: true; translations: string[] }
    | { ok: false; code: TranslationErrorCode };

/** A text that could not be translated, for the vendor to check before saving. */
export type TranslationReviewItem = {
    path: string;
    /** The language the vendor typed it in. */
    from: Language;
    /** The language it still needs. */
    to: Language;
    /** What the vendor typed. */
    text: string;
    /** What the other language holds now — an existing translation, or "". */
    current: string;
};

export type TranslationOutcome<T> = {
    /** Translated where possible; untranslated texts copied into empty fields. */
    result: T;
    /** Why some texts were not translated; `null` when translation worked. */
    error: TranslationErrorCode | null;
    /** The texts behind `error`, so the vendor can write them in. */
    review: TranslationReviewItem[];
};

const filled = (value: string | undefined | null) => !!value && value.trim() !== "";
const other = (lang: Language): Language => (lang === "en" ? "pt" : "en");

export async function translateWith<T>(
    object: T,
    lang: Language,
    send: (request: TranslationRequest) => Promise<TranslationReply>,
): Promise<TranslationOutcome<T>> {
    const { texts: onScreen, paths } = extractFields(object, lang);
    const { texts: hidden } = extractFields(object, other(lang));

    // Group each field by the language it will be translated FROM.
    const jobs: Record<Language, { path: string; text: string; current: string }[]> = { en: [], pt: [] };
    paths.forEach((path, index) => {
        if (filled(onScreen[index])) {
            jobs[lang].push({ path, text: onScreen[index], current: hidden[index] ?? "" });
        } else if (filled(hidden[index])) {
            jobs[other(lang)].push({ path, text: hidden[index], current: onScreen[index] ?? "" });
        }
    });

    const updates: TranslationUpdate[] = [];
    const fallback: TranslationUpdate[] = [];
    const review: TranslationReviewItem[] = [];
    let error: TranslationErrorCode | null = null;

    for (const source of [lang, other(lang)]) {
        const batch = jobs[source];
        if (!batch.length) continue;
        const target = other(source);

        let reply: TranslationReply;
        try {
            reply = await send({
                texts: batch.map((job) => job.text),
                sourceLang: source.toUpperCase() as DeepLLang,
                targetLang: target.toUpperCase() as DeepLLang,
            });
        } catch {
            reply = { ok: false, code: "UNAVAILABLE" };
        }

        if (reply.ok && Array.isArray(reply.translations) && reply.translations.length === batch.length) {
            batch.forEach((job, index) => {
                updates.push({ path: job.path, language: target, text: reply.translations[index] });
                // A blank translation for one text: that text falls back too.
                fallback.push({ path: job.path, language: target, text: job.text });
            });
        } else {
            error ??= reply.ok ? "UNAVAILABLE" : reply.code;
            batch.forEach((job) => {
                fallback.push({ path: job.path, language: target, text: job.text });
                review.push({ path: job.path, from: source, to: target, text: job.text, current: job.current });
            });
        }
    }

    try {
        const translated = applyTranslations(object, updates);
        return { result: applyTranslations(translated, fallback, { fillEmptyOnly: true }), error, review };
    } catch {
        // Something in the form data could not be copied. Hand it back as it
        // was; the save will report what is missing.
        return { result: object, error: error ?? "UNAVAILABLE", review: [] };
    }
}

const NOTICE: Record<Language, { reason: Record<TranslationErrorCode, string>; outcome: string }> = {
    en: {
        reason: {
            QUOTA_EXCEEDED: "The automatic translation limit has been reached.",
            RATE_LIMITED: "Too many translations in a short time.",
            UNAUTHORIZED: "Your session has expired.",
            INVALID_REQUEST: "The text could not be translated.",
            UNAVAILABLE: "Automatic translation is unavailable right now.",
        },
        outcome:
            "Saving without translation — check the other language later by switching the portal language.",
    },
    pt: {
        reason: {
            QUOTA_EXCEEDED: "O limite de tradução automática foi atingido.",
            RATE_LIMITED: "Demasiadas traduções num curto espaço de tempo.",
            UNAUTHORIZED: "A sua sessão expirou.",
            INVALID_REQUEST: "Não foi possível traduzir o texto.",
            UNAVAILABLE: "A tradução automática não está disponível de momento.",
        },
        outcome:
            "A guardar sem tradução — reveja o outro idioma mais tarde, mudando o idioma do portal.",
    },
};

/** Why translation failed, as one sentence in the portal's language. */
export function translationReason(code: TranslationErrorCode, lang: Language): string {
    const notice = NOTICE[lang] ?? NOTICE.en;
    return notice.reason[code] ?? notice.reason.UNAVAILABLE;
}

/** The notice shown when texts are saved untranslated, in the portal's language. */
export function translationNotice(code: TranslationErrorCode, lang: Language): string {
    const notice = NOTICE[lang] ?? NOTICE.en;
    return `${translationReason(code, lang)} ${notice.outcome}`;
}
