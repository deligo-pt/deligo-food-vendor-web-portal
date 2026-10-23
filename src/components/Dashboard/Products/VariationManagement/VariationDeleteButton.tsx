"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

interface IProps {
  onConfirm: () => void;
  label?: string;
  size?: "sm" | "xs";
}

/**
 * Delete a variation group (`sm`, with its label) or one option (`xs`, the
 * icon), then confirm. Red and outlined so it can be found: it was a
 * near-white grey icon that vendors missed (23 Oct 2026).
 */
export default function VariationDeleteButton({
  onConfirm,
  label = "Delete",
  size = "sm",
}: IProps) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="inline-flex items-center gap-1"
      >
        <button
          type="button"
          onClick={() => {
            onConfirm();
            setConfirming(false);
          }}
          className={`${size === "xs" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs"} bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors`}
        >
          {t("variation_confirm_delete")}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className={`${size === "xs" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs"} bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors`}
        >
          {t("cancel")}
        </button>
      </motion.div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={`inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 ${size === "xs" ? "p-1" : "px-2 py-1 text-xs"}`}
      title={label}
      aria-label={label}
    >
      <Trash2Icon size={size === "xs" ? 13 : 14} />
      {size === "sm" && <span>{label}</span>}
    </button>
  );
}
