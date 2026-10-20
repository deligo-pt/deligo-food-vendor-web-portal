import type { Language, TranslationErrorCode } from "@/src/types/translation.type";
import type { TranslationReviewItem } from "./translateWith";

export type TranslationReviewRequest = {
    items: TranslationReviewItem[];
    reason: TranslationErrorCode;
    /** The portal's language, which the dialog is written in. */
    lang: Language;
};

/**
 * The vendor's answer: the text for each item's other language, by `path` —
 * or `null` when they cancelled and want to go back to the form.
 */
export type TranslationReviewAnswer = Record<string, string> | null;

type Reviewer = (request: TranslationReviewRequest) => Promise<TranslationReviewAnswer>;

// The dialog mounted in the vendor layout registers itself here, so
// `translateObject` — called from inside 15 forms' submit handlers — can ask
// the vendor without each form rendering its own dialog.
let reviewer: Reviewer | null = null;

export function registerTranslationReviewer(next: Reviewer) {
    reviewer = next;
    return () => {
        if (reviewer === next) reviewer = null;
    };
}

/** `undefined` when no dialog is mounted to ask: the caller saves the fallback. */
export function reviewTranslations(
    request: TranslationReviewRequest,
): Promise<TranslationReviewAnswer> | undefined {
    return reviewer?.(request);
}
