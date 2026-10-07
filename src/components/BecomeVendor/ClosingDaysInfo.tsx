"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslation } from "@/src/hooks/use-translation";
import { Info } from "lucide-react";
import { useState } from "react";

/**
 * The ⓘ beside "Closing Days" on registration (7 Oct 2026). Vendors were
 * picking many closing days without knowing what one is; this says what it
 * means and that at most two can be chosen.
 *
 * A mouse opens it on hover; a tap toggles it, since touch has no hover. It
 * closes on a click outside or Esc.
 */
export function ClosingDaysInfo() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("closing_days_info_label")}
          onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(true)}
          onPointerLeave={(event) => event.pointerType === "mouse" && setOpen(false)}
          className="inline-flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full text-gray-400 transition-colors hover:text-[#DC3173] data-[state=open]:text-[#DC3173]"
        >
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-72 max-w-[calc(100vw-2rem)] rounded-2xl border-[#DC3173]/15 p-4 shadow-lg"
      >
        <p className="text-sm font-semibold text-gray-900">{t("closingDays")}</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-600">{t("closing_days_info")}</p>
      </PopoverContent>
    </Popover>
  );
}
