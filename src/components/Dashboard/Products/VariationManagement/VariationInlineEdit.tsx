"use client";

import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * A variation group's name with an always-visible edit button.
 *
 * The pencil used to appear only on hover — invisible on touch screens and
 * easy to miss everywhere else — and the name saved on blur, so clicking away
 * from an unchanged name raised "at least 2 characters". Now the button is
 * always there, and only Save (or Enter) saves; Escape and Cancel discard.
 */

interface IProps {
  value: string;
  onSave: (val: string) => void;
  t: (key: string) => string;
  className?: string;
}

export const MIN_VARIATION_NAME = 2;

export default function VariationInlineEdit({ value, onSave, t, className = "" }: IProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    const next = draft.trim();
    if (next.length < MIN_VARIATION_NAME) {
      toast.error(t("variation_name_min"));
      return;
    }
    if (next !== value) onSave(next);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex min-w-0 items-center gap-1">
        <span className={`wrap-anywhere ${className}`}>{value}</span>
        <button
          type="button"
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          aria-label={`${t("edit")} ${value}`}
          className="shrink-0 rounded-md p-1 text-[#DC3173] hover:bg-[#DC3173]/10"
        >
          <PencilIcon size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-1">
      <input
        autoFocus
        value={draft}
        aria-label={t("variation_name")}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        className="w-32 min-w-0 rounded-lg border border-[#DC3173]/20 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC3173]/50 sm:w-40"
      />
      <button
        type="button"
        onClick={commit}
        aria-label={t("save")}
        className="shrink-0 rounded-md p-1 text-green-600 hover:bg-green-50"
      >
        <CheckIcon size={16} />
      </button>
      <button
        type="button"
        onClick={cancel}
        aria-label={t("cancel")}
        className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-100"
      >
        <XIcon size={16} />
      </button>
    </div>
  );
}
