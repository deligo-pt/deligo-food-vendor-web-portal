import { NextRequest, NextResponse } from "next/server";
import { DeepLError, translateTexts } from "@/lib/deepl";
import { verifyJWT } from "@/src/utils/verifyJWT";
import { TranslationErrorCode } from "@/src/types/translation.type";

// Limits on one request: the forms send a handful of names and descriptions,
// never more than this.
const MAX_TEXTS = 50;
const MAX_TEXT_LENGTH = 5000;
const MAX_TOTAL_LENGTH = 20000;

// Per vendor, per server instance. Not a hard guarantee on serverless, but it
// stops one session (or a script holding a token) from draining the quota.
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;
const recentRequests = new Map<string, number[]>();

function isRateLimited(userId: string) {
    const now = Date.now();
    const recent = (recentRequests.get(userId) ?? []).filter(
        (time) => now - time < RATE_WINDOW_MS,
    );

    if (recent.length >= RATE_LIMIT) {
        recentRequests.set(userId, recent);
        return true;
    }

    recent.push(now);
    recentRequests.set(userId, recent);
    return false;
}

const LANGS = ["EN", "PT"] as const;
const isLang = (value: unknown): value is (typeof LANGS)[number] =>
    LANGS.includes(value as (typeof LANGS)[number]);

function fail(status: number, code: TranslationErrorCode, message: string) {
    return NextResponse.json({ success: false, code, message }, { status });
}

export async function POST(req: NextRequest) {
    // The proxy does not cover /api, and it lets every POST through, so the
    // route checks the session itself. Before 20 Oct 2026 anyone could call
    // it and spend the DeepL quota.
    const accessToken = req.cookies.get("accessToken")?.value;
    const session = accessToken ? await verifyJWT(accessToken) : null;
    const userId = session?.success ? String(session.data?.userId ?? "") : "";

    if (!userId) {
        return fail(401, "UNAUTHORIZED", "Sign in to use translation");
    }

    if (isRateLimited(userId)) {
        return fail(429, "RATE_LIMITED", "Too many translation requests, try again in a minute");
    }

    const body = await req.json().catch(() => null);
    const { texts, sourceLang, targetLang } = body ?? {};

    if (
        !Array.isArray(texts) ||
        !texts.every((text) => typeof text === "string") ||
        !isLang(sourceLang) ||
        !isLang(targetLang) ||
        sourceLang === targetLang
    ) {
        return fail(400, "INVALID_REQUEST", "Expected texts[] and two different languages (EN, PT)");
    }

    if (
        texts.length > MAX_TEXTS ||
        texts.some((text: string) => text.length > MAX_TEXT_LENGTH) ||
        texts.reduce((total: number, text: string) => total + text.length, 0) > MAX_TOTAL_LENGTH
    ) {
        return fail(400, "INVALID_REQUEST", "Too much text in one translation request");
    }

    try {
        const translations = await translateTexts({
            texts,
            sourceLang,
            targetLang,
        });

        return NextResponse.json({
            success: true,
            translations,
        });
    } catch (error) {
        if (error instanceof DeepLError) {
            console.error(`DeepL ${error.status} ${error.code}: ${error.message}`);

            return fail(
                503,
                error.code === "QUOTA_EXCEEDED" || error.code === "RATE_LIMITED"
                    ? error.code
                    : "UNAVAILABLE",
                error.code === "QUOTA_EXCEEDED"
                    ? "The translation limit has been reached"
                    : "Translation is unavailable right now",
            );
        }

        console.error("Translation failed:", error);
        return fail(503, "UNAVAILABLE", "Translation is unavailable right now");
    }
}
