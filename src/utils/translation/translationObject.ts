import { toast } from "sonner";
import type { Language } from "@/src/types/translation.type";
import { applyTranslations } from "./applyTranslations";
import {
    translateWith,
    translationNotice,
    type TranslationReply,
    type TranslationRequest,
} from "./translateWith";
import { reviewTranslations } from "./translationReview";

async function requestTranslations(request: TranslationRequest): Promise<TranslationReply> {
    try {
        const response = await fetch("/api/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
            return { ok: false, code: result?.code ?? "UNAVAILABLE" };
        }

        return { ok: true, translations: result.translations };
    } catch {
        return { ok: false, code: "UNAVAILABLE" };
    }
}

/**
 * Fill the other language of every `{ en, pt }` text in `object`.
 *
 * Never throws. When translation is unavailable the translation dialog asks
 * the vendor to write the other language or keep the same text, and the
 * save goes ahead with their answer. Resolves `null` when they cancel: the
 * caller stops, closes its loading toast and leaves the form as it was.
 */
export async function translateObject<T>(
    object: T,
    sourceLanguage: Language
): Promise<T | null> {
    const { result, error, review } = await translateWith(object, sourceLanguage, requestTranslations);

    if (!error) return result;

    const answer = review.length
        ? await reviewTranslations({ items: review, reason: error, lang: sourceLanguage })
        : undefined;

    if (answer === null) return null;

    if (answer) {
        return applyTranslations(
            result,
            review.map((item) => ({ path: item.path, language: item.to, text: answer[item.path] ?? "" })),
        );
    }

    // No dialog mounted to ask: save what was typed, and say so.
    toast.warning(translationNotice(error, sourceLanguage), {
        id: "translation-unavailable",
        duration: 8000,
    });

    return result;
}
