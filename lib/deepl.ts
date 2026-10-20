// lib/deepl.ts
//
// No `@/` imports, so `pnpm verify:translation` can run it under bare Node
// with a stubbed `fetch`.

export type DeepLLang = "EN" | "PT";

export type DeepLErrorCode = "QUOTA_EXCEEDED" | "RATE_LIMITED" | "CONFIG" | "UNAVAILABLE";

/**
 * A refused DeepL call, with the status and DeepL's own message kept. The old
 * code threw a bare "DeepL Translation Failed", so a 456 (quota exceeded —
 * the 20 Oct 2026 outage) looked the same as a network blip in the logs.
 */
export class DeepLError extends Error {
    status: number;
    code: DeepLErrorCode;

    constructor(status: number, code: DeepLErrorCode, message: string) {
        super(message);
        this.name = "DeepLError";
        this.status = status;
        this.code = code;
    }
}

export function deeplErrorCode(status: number): DeepLErrorCode {
    if (status === 456) return "QUOTA_EXCEEDED";
    if (status === 429) return "RATE_LIMITED";
    if (status === 401 || status === 403) return "CONFIG";
    return "UNAVAILABLE";
}

// Same text, same direction → same translation. Vendors save the same names
// ("Pizza", "Bebidas") over and over; each repeat used to cost characters.
const CACHE_LIMIT = 1000;
const cache = new Map<string, string>();
const cacheKey = (text: string, sourceLang: DeepLLang, targetLang: DeepLLang) =>
    `${sourceLang}>${targetLang}:${text}`;

function remember(key: string, value: string) {
    if (cache.size >= CACHE_LIMIT) {
        cache.delete(cache.keys().next().value as string);
    }
    cache.set(key, value);
}

export function clearTranslationCache() {
    cache.clear();
}

export async function translateTexts({
    texts,
    sourceLang,
    targetLang,
}: {
    texts: string[];
    sourceLang: DeepLLang;
    targetLang: DeepLLang;
}): Promise<string[]> {
    if (!texts.length) return [];

    // Only non-empty texts not already cached go to DeepL, each once.
    const pending = [
        ...new Set(
            texts.filter(
                (text) => text.trim() && !cache.has(cacheKey(text, sourceLang, targetLang)),
            ),
        ),
    ];

    if (pending.length) {
        const apiKey = process.env.DEEPL_API_KEY;
        if (!apiKey) {
            throw new DeepLError(500, "CONFIG", "DEEPL_API_KEY is not set");
        }

        const params = new URLSearchParams();
        pending.forEach((text) => params.append("text", text));
        params.append("source_lang", sourceLang);
        params.append("target_lang", targetLang);

        const response = await fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            headers: {
                Authorization: `DeepL-Auth-Key ${apiKey}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });

        if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new DeepLError(
                response.status,
                deeplErrorCode(response.status),
                body?.message || response.statusText || "DeepL request failed",
            );
        }

        const result = (await response.json()) as { translations?: { text: string }[] };
        const translated = result.translations ?? [];

        if (translated.length !== pending.length) {
            throw new DeepLError(502, "UNAVAILABLE", "DeepL returned an unexpected number of translations");
        }

        pending.forEach((text, index) => {
            remember(cacheKey(text, sourceLang, targetLang), translated[index].text);
        });
    }

    return texts.map((text) =>
        text.trim() ? cache.get(cacheKey(text, sourceLang, targetLang)) ?? "" : "",
    );
}
