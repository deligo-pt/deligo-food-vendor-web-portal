"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, Layers } from "lucide-react";

interface IProps {
  status: string;
  hasVariations: boolean;
}

export default function StockStatusBadge({ status, hasVariations }: IProps) {
  if (hasVariations) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
        <Layers size={12} />
        Has Variations
      </span>
    );
  }

  const config = {
    "In Stock": {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: CheckCircle2,
    },
    "Out of Stock": {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: AlertCircle,
    },
    Limited: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: AlertTriangle,
    },
  };

  const style = config[status as keyof typeof config] || config["In Stock"];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.text}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}
