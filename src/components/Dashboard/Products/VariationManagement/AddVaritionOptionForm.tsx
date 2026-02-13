"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface IProps {
  onAdd: (label: string, sku: string, price: number) => void;
  onCancel: () => void;
}

export default function AddVaritionOptionForm({ onAdd, onCancel }: IProps) {
  const [label, setLabel] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!label.trim() || !sku.trim()) return;
    onAdd(label.trim(), sku.trim().toUpperCase(), parseFloat(price) || 0);
    setLabel("");
    setSku("");
    setPrice("");
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
        height: 0,
      }}
      animate={{
        opacity: 1,
        height: "auto",
      }}
      exit={{
        opacity: 0,
        height: 0,
      }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap items-end gap-3 p-3 bg-brand-50/50 rounded-xl border border-brand-100 mt-3">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Option Label
          </label>
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Medium"
            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
        <div className="w-28">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            SKU
          </label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="SKU-001"
            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
        <div className="w-24">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="0.00"
            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={!label.trim() || !sku.trim()}
            className="px-4 py-1.5 bg-brand-500 text-white rounded-lg text-sm font-bold hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
