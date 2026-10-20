export type Language = "en" | "pt";

export interface TranslationResult {
    texts: string[];
    paths: string[];
}

/** What `/api/translate` answers in `code` when it cannot translate. */
export type TranslationErrorCode =
    | "QUOTA_EXCEEDED"
    | "RATE_LIMITED"
    | "UNAUTHORIZED"
    | "INVALID_REQUEST"
    | "UNAVAILABLE";

/** One text to write into one `{ en, pt }` field, found at `path`. */
export interface TranslationUpdate {
    path: string;
    language: Language;
    text: string;
}
