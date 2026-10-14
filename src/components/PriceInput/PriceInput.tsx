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
  // The text as typed, and the number it last reported. When the form sets a
  // different number (a reset after saving), the text follows it.
  const [draft, setDraft] = useState({ text: formatPrice(current), value: current });
  if (draft.value !== current) {
    setDraft({ text: formatPrice(current), value: current });
  }

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={draft.value !== current ? formatPrice(current) : draft.text}
      onChange={(event) => {
        const text = event.target.value;
        if (!PRICE_TYPING.test(text)) return;
        const next = parsePrice(text);
        setDraft({ text, value: next });
        onValueChange(next);
      }}
      onBlur={(event) => {
        if (draft.value !== undefined) {
          setDraft({ text: formatPrice(draft.value), value: draft.value });
        }
        onBlur?.(event);
      }}
    />
  );
}
