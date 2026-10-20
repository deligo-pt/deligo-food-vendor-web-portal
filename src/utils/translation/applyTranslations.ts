/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TranslationUpdate } from "@/src/types/translation.type";

/**
 * Write each update into the `{ en, pt }` field at its path, on a copy.
 *
 * An empty text never replaces anything: a blank translation used to wipe the
 * language the vendor had typed. With `fillEmptyOnly` (the fallback when
 * translation is unavailable) a field that already holds text keeps it.
 */
export function applyTranslations<T>(
    object: T,
    updates: TranslationUpdate[],
    { fillEmptyOnly = false }: { fillEmptyOnly?: boolean } = {},
): T {
    const cloned: any = structuredClone(object);

    updates.forEach(({ path, language, text }) => {
        if (!text?.trim()) return;

        let field = cloned;
        for (const key of path ? path.split(".") : []) {
            field = field?.[key];
        }

        if (!field || typeof field !== "object") return;
        if (fillEmptyOnly && field[language]?.trim()) return;

        field[language] = text;
    });

    return cloned;
}
