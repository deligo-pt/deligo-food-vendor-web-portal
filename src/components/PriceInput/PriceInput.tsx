"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * A money field: free typing, decimals from the first key, no spinner.
 *
 * `type="number"` drew up/down arrows that stepped by whole euros, read "9."
 * as 9 while the vendor was still typing, turned an empty box into NaN, and
 * refused a Portuguese "9,99". This is a text field with the decimal keypad
 * on phones instead:
 *
 * - digits and one separator, `.` or `,`, with at most two decimals — any
 *   other keystroke is ignored, so the box can never hold something invalid;
 * - "0.", ".5" and "9," are kept exactly as typed while editing;
 * - the form gets a number, or `undefined` for an empty box (never 0 or NaN);
 * - leaving the field tidies it to two decimals ("9,5" → "9.50").
 */

const PRICE_TYPING = /^\d*([.,]\d{0,2})?$/;

/** The number in what was typed, or `undefined` when there is none yet. */
export function parsePrice(text: string): number | undefined {
  const normalized = text.trim().replace(",", ".");
  if (normalized === "" || normalized === ".") return undefined;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : undefined;
}

function formatPrice(value: number | undefined): string {
  return value === undefined ? "" : value.toFixed(2);
}

type PriceInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "defaultValue" | "onChange" | "inputMode"
> & {
  value: number | null | undefined;
  onValueChange: (value: number | undefined) => void;
};

export default function PriceInput({
  value,
  onValueChange,
  onBlur,
  ...props
}: PriceInputProps) {
  const current = typeof value === "number" && Number.isFinite(value) ? value : undefined;
  // `text` as typed, `value` the number it last reported, `parent` the value
  // the form last handed in. The text follows the form only when the form's
  // value really moves on its own — a reset after saving — never when it
  // merely echoes what was typed. React Hook Form shows a field's *default*
  // while its value is empty, so following every difference re-wrote an
  // emptied Add Item price to "0.00" and nothing typed after it fit.
  const [draft, setDraft] = useState({ text: formatPrice(current), value: current, parent: current });
  let shown = draft;
  if (current !== draft.parent) {
    shown =
      current === draft.value
        ? { ...draft, parent: current }
        : { text: formatPrice(current), value: current, parent: current };
    setDraft(shown);
  }

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={shown.text}
      onChange={(event) => {
        const text = event.target.value;
        if (!PRICE_TYPING.test(text)) return;
        const next = parsePrice(text);
        setDraft({ ...shown, text, value: next });
        onValueChange(next);
      }}
      onBlur={(event) => {
        if (shown.value !== undefined) {
          setDraft({ ...shown, text: formatPrice(shown.value) });
        }
        onBlur?.(event);
      }}
    />
  );
}
