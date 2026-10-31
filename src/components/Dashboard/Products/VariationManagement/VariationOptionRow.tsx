"use client";

import PriceInput from "@/src/components/PriceInput/PriceInput";
import VariationDeleteButton from "@/src/components/Dashboard/Products/VariationManagement/VariationDeleteButton";
import { MIN_VARIATION_NAME } from "@/src/components/Dashboard/Products/VariationManagement/VariationInlineEdit";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * One option of a variation group on Variation Management: name, price and
 * (for stores) stock, with Edit and Delete always in view.
 *
 * Edit opens name and price together with one Save, which calls only what
 * changed — the rename and/or the price endpoint. Escape or Cancel discards;
 * nothing saves on blur. The price goes through `PriceInput`, so a Portuguese
 * "9,99" stays 9.99.
 */

interface IProps {
  label: string;
  price: number;
  stock?: { quantity?: number; isOutOfStock?: boolean };
  onRename: (label: string) => void;
  onPrice: (price: number) => void;
  onDelete: () => void;
  t: (key: string) => string;
}

export default function VariationOptionRow({ label, price, stock, onRename, onPrice, onDelete, t }: IProps) {
  const [editing, setEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(label);
  const [draftPrice, setDraftPrice] = useState<number | undefined>(price);

  const open = () => {
    setDraftLabel(label);
    setDraftPrice(price);
    setEditing(true);
  };

  const save = () => {
    const nextLabel = draftLabel.trim();
    if (nextLabel.length < MIN_VARIATION_NAME) {
      toast.error(t("variation_name_min"));
      return;
    }
    if (draftPrice === undefined || draftPrice <= 0) {
      toast.error(t("variation_price_min"));
      return;
    }
    if (nextLabel !== label) onRename(nextLabel);
    if (draftPrice !== price) onPrice(draftPrice);
    setEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-gray-600">
          {t("option_label")}
          <input
            autoFocus
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            onKeyDown={onKeyDown}
            className="h-9 w-full rounded-lg border border-[#DC3173]/20 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DC3173]/50"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-600 sm:w-36">
          {t("option_price")} (€)
          <PriceInput
            value={draftPrice}
            onValueChange={setDraftPrice}
            onKeyDown={onKeyDown}
            className="h-9 w-full rounded-lg border border-[#DC3173]/20 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DC3173]/50"
          />
        </label>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="h-9 rounded-lg bg-gray-100 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={save}
            className="h-9 rounded-lg bg-[#DC3173] px-4 text-sm font-bold text-white transition-colors hover:bg-[#DC3173]/90"
          >
            {t("save")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5">
      <span className="min-w-0 flex-1 basis-28 text-sm font-medium text-gray-800 wrap-anywhere">{label}</span>
      <span className="shrink-0 text-sm font-medium text-gray-800">{price.toFixed(2)}&nbsp;€</span>
      {stock && (
        <span className="shrink-0 text-xs text-gray-500">
          {t("stock")}: {stock.quantity}
        </span>
      )}
      {stock?.isOutOfStock && (
        <span className="shrink-0 rounded bg-red-50 px-1.5 py-0.5 text-xs font-bold text-red-500">
          {t("out_of_stock")}
        </span>
      )}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={open}
          aria-label={`${t("edit")} ${label}`}
          className="inline-flex items-center gap-1 rounded-lg border border-[#DC3173]/20 bg-white px-2 py-1 text-xs font-semibold text-[#DC3173] transition-colors hover:bg-[#DC3173]/10"
        >
          <PencilIcon size={13} />
          {t("edit")}
        </button>
        <VariationDeleteButton onConfirm={onDelete} label={t("delete_option")} size="xs" />
      </div>
    </div>
  );
}
