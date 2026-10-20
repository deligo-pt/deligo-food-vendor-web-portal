"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/src/hooks/use-translation";
import type { Language } from "@/src/types/translation.type";
import { translationReason } from "@/src/utils/translation/translateWith";
import {
    registerTranslationReviewer,
    type TranslationReviewAnswer,
    type TranslationReviewRequest,
} from "@/src/utils/translation/translationReview";
import { motion } from "framer-motion";
import { CopyIcon, LanguagesIcon, SaveIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const inputClassName =
    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all";

// Longer texts (descriptions) get a textarea, names an input.
const isLongText = (text: string) => text.length > 60 || text.includes("\n");

/**
 * Asks the vendor what to save when automatic translation is unavailable.
 *
 * Mounted once in the vendor layout; `translateObject` opens it through
 * `reviewTranslations`, so every form that translates gets it. The vendor sees
 * what they typed and either writes the other language, keeps the same text
 * in both, or cancels back to the form — never a silent half-translated save.
 */
export default function TranslationReviewDialog() {
    const { t } = useTranslation();
    const [request, setRequest] = useState<TranslationReviewRequest | null>(null);
    const [values, setValues] = useState<Record<string, string>>({});
    const [showErrors, setShowErrors] = useState(false);
    const resolveRef = useRef<((answer: TranslationReviewAnswer) => void) | null>(null);

    useEffect(() => {
        const unregister = registerTranslationReviewer(
            (next) =>
                new Promise<TranslationReviewAnswer>((resolve) => {
                    // A second request while one is open cancels the first.
                    resolveRef.current?.(null);
                    resolveRef.current = resolve;
                    setValues(Object.fromEntries(next.items.map((item) => [item.path, item.current])));
                    setShowErrors(false);
                    setRequest(next);
                }),
        );

        return () => {
            unregister();
            resolveRef.current?.(null);
            resolveRef.current = null;
        };
    }, []);

    const finish = (answer: TranslationReviewAnswer) => {
        resolveRef.current?.(answer);
        resolveRef.current = null;
        setRequest(null);
    };

    const items = request?.items ?? [];
    const missing = items.filter((item) => !values[item.path]?.trim());

    const languageName = (language: Language) => {
        const name = t(language === "en" ? "english" : "portuguese");
        // "Versão em inglês": language names are lowercase mid-sentence in PT.
        return request?.lang === "pt" ? name.toLowerCase() : name;
    };

    const fieldLabel = (path: string) => {
        const keys = path.split(".");
        const field = [...keys].reverse().find((key) => !/^\d+$/.test(key)) ?? "";
        const key = field === "title" || !field ? `translation_field_${field || "text"}` : field;
        const label = t(key) === key ? t("translation_field_text") : t(key);
        const position = keys.find((key) => /^\d+$/.test(key));
        return position === undefined ? label : `${label} ${Number(position) + 1}`;
    };

    const save = () => {
        if (missing.length) {
            setShowErrors(true);
            return;
        }
        finish(values);
    };

    const keepSameText = () => {
        finish(
            Object.fromEntries(
                items.map((item) => [item.path, values[item.path]?.trim() ? values[item.path] : item.text]),
            ),
        );
    };

    return (
        <Dialog open={!!request} onOpenChange={(open) => !open && finish(null)}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border-none gap-0">
                <DialogHeader className="bg-linear-to-r from-[#DC3173] to-[#E95A9E] p-6 text-white text-left">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
                        <LanguagesIcon className="w-6 h-6 shrink-0" />
                        {t("translation_review_title")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-white/90">
                        {request && translationReason(request.reason, request.lang)}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-5 bg-white max-h-[60vh] overflow-y-auto">
                    <p className="text-sm text-gray-600">{t("translation_review_intro")}</p>

                    {items.map((item) => {
                        const invalid = showErrors && !values[item.path]?.trim();
                        const fieldId = `translation-review-${item.path}`;
                        const Field = isLongText(item.text) ? Textarea : Input;

                        return (
                            <div key={item.path} className="space-y-2">
                                <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
                                    {fieldLabel(item.path)}
                                </label>

                                <div className="rounded-lg bg-[#DC3173]/5 border border-[#DC3173]/20 px-3 py-2">
                                    <p className="text-xs font-medium text-[#DC3173]">
                                        {t("translation_review_you_typed").replace("{language}", languageName(item.from))}
                                    </p>
                                    <p className="text-sm text-gray-800 whitespace-pre-line wrap-break-word">{item.text}</p>
                                </div>

                                <p className="text-xs font-medium text-gray-500">
                                    {t("translation_review_version").replace("{language}", languageName(item.to))}
                                </p>
                                <Field
                                    id={fieldId}
                                    value={values[item.path] ?? ""}
                                    onChange={(event) =>
                                        setValues((current) => ({ ...current, [item.path]: event.target.value }))
                                    }
                                    placeholder={item.text}
                                    aria-invalid={invalid}
                                    className={`${inputClassName} ${invalid ? "border-red-500" : "border-gray-300"}`}
                                />
                                {item.current && !invalid && (
                                    <p className="text-xs text-gray-500">{t("translation_review_current_hint")}</p>
                                )}
                                {invalid && <p className="text-xs text-red-500">{t("translation_review_required")}</p>}
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-6 pt-4 bg-white border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => finish(null)}
                        className="px-5 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    >
                        {t("cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={keepSameText}
                        className="flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-medium text-[#DC3173] border border-[#DC3173] hover:bg-[#DC3173]/5 transition-all duration-200"
                    >
                        <CopyIcon className="w-4 h-4 mr-2" />
                        {t("translation_review_keep_same")}
                    </button>
                    <motion.button
                        type="button"
                        onClick={save}
                        className="flex items-center justify-center px-5 py-2.5 rounded-md shadow-sm text-sm font-medium text-white bg-[#DC3173] hover:bg-[#DC3173]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DC3173] transition-all duration-200"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <SaveIcon className="w-4 h-4 mr-2" />
                        {t("save")}
                    </motion.button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
