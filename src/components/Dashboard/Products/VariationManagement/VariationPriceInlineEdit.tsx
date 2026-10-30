"use client";

import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PriceInput from "@/src/components/PriceInput/PriceInput";

/**
 * Click-to-edit for an option's price on Variation Management.
 *
 * The price used to go through the name editor: free text shown as "€9.99",
 * cleaned with `/[^0-9.]/g` on save. A Portuguese "9,99" lost its comma and
 * saved as €999, and the name rule ("at least 2 characters") refused a price
 * like "5". This edits the number itself through `PriceInput` — comma or dot,
 * two decimals — and asks only that it be above zero.
 */

interface IProps {
  title: string;
  value: number;
  onSave: (price: number) => void;
  className?: string;
}

export default function VariationPriceInlineEdit({
  title,
  value,
  onSave,
  className = "",
}: IProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<number | undefined>(value);

  const commit = () => {
    if (draft === undefined || draft <= 0) {
      toast.error(`${title} must be greater than 0`);
      return;
    }
    if (draft !== value) onSave(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className={`group inline-flex items-center gap-1.5 text-left ${className}`}
      >
        <span>{value.toFixed(2)}&nbsp;€</span>
        <PencilIcon
          size={12}
          className="text-[#DC3173] opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <PriceInput
        autoFocus
        aria-label={title}
        value={draft}
        onValueChange={setDraft}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        className="h-7 px-2 py-0.5 rounded-lg border border-[#DC3173]/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC3173]/50 w-24"
      />
      <span className="text-sm text-gray-500">€</span>
      <button
        onClick={commit}
        className="p-0.5 text-green-600 hover:bg-green-50 rounded"
        aria-label="Save"
      >
        <CheckIcon size={14} />
      </button>
      <button
        onClick={cancel}
        className="p-0.5 text-gray-400 hover:bg-gray-50 rounded"
        aria-label="Cancel"
      >
        <XIcon size={14} />
      </button>
    </div>
  );
}
