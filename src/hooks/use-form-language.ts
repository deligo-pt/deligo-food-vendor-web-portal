"use client";

import { useEffect, useRef } from "react";
import type { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { carryOverText, type FormLang, type LocalizedText } from "@/src/utils/formLanguage";

/**
 * Keeps a bilingual form in step with the portal's language.
 *
 * A form that shows one field per text (`title.pt` in PT, `title.en` in EN)
 * and checks the field for `currentLang` must have `currentLang` follow the
 * page — it used to be set once on mount, and a language switch then left the
 * check on a field that was no longer on screen. See `formLanguage.ts`.
 *
 * On every change of `lang`:
 * - `currentLang` is updated, so the check is on the visible field;
 * - each text in `localizedFields` carries its typed text across into the
 *   newly visible language if that one is empty (`carryOverText`);
 * - errors on those texts are cleared — they were about the hidden field.
 */
export function useFormLanguage<T extends FieldValues & { currentLang: FormLang }>(
  form: UseFormReturn<T>,
  lang: FormLang,
  localizedFields: Path<T>[],
) {
  const previous = useRef<FormLang>(lang);
  // A string, so a new array literal each render does not re-run the effect.
  const fieldsKey = localizedFields.join("|");

  useEffect(() => {
    const fields = (fieldsKey ? fieldsKey.split("|") : []) as Path<T>[];
    const from = previous.current;
    previous.current = lang;

    if (form.getValues("currentLang" as Path<T>) !== lang) {
      form.setValue("currentLang" as Path<T>, lang as PathValue<T, Path<T>>);
    }
    if (from === lang) return;

    for (const field of fields) {
      const value = form.getValues(field) as LocalizedText;
      const next = carryOverText(value, from, lang);
      if (next.en !== value?.en || next.pt !== value?.pt) {
        form.setValue(field, next as PathValue<T, Path<T>>, { shouldDirty: true });
      }
    }
    form.clearErrors(fields);
  }, [form, lang, fieldsKey]);
}
