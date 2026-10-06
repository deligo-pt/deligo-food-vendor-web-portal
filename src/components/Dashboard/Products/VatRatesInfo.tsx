"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * VAT rate explanations for Add Item's tax dropdown (6 Oct 2026).
 *
 * Each rate in the list carries its own ⓘ ("Standard VAT (23%) ⓘ"), which
 * explains that rate only. The field no longer pre-selects 23%, so the vendor
 * chooses, and this helps them choose. Static copy, matched by the rate's
 * percentage rather than its name.
 */
export const VAT_RATE_INFO: Record<number, { title: string; body: string }> = {
  0: { title: "vat_info_0_title", body: "vat_info_0_body" },
  6: { title: "vat_info_6_title", body: "vat_info_6_body" },
  13: { title: "vat_info_13_title", body: "vat_info_13_body" },
  23: { title: "vat_info_23_title", body: "vat_info_23_body" },
};

/** Card width, and the gap between the card and the list. */
const CARD_WIDTH = 288;
const GAP = 8;

/**
 * The ⓘ inside one dropdown row.
 *
 * ## Why not a Popover
 *
 * The row lives inside a Radix Select, which traps focus and blocks pointer
 * events outside its list while open. A Popover nested in it would fight both,
 * and closing the list would close it. So the card is drawn in a portal, fixed
 * beside the list, `pointer-events-none`, and never takes focus.
 *
 * ## Pressing the ⓘ never chooses the rate
 *
 * Radix selects a row on `pointerup` (mouse) or `click` (touch). The ⓘ stops
 * both, and `pointerdown`, from reaching the row. A mouse shows the card on
 * hover; a tap toggles it, since touch has no hover. Pressing anywhere else on
 * the row selects as before.
 *
 * Keyboard and screen readers can't reach the ⓘ, because the list moves by
 * arrow keys, so the same text is the row's description (`aria-describedby`,
 * see `describedById`).
 */
export function VatRateInfoIcon({ rate, describedById }: { rate: number; describedById: string }) {
  const { t } = useTranslation();
  const info = VAT_RATE_INFO[rate];
  const iconRef = useRef<HTMLSpanElement>(null);
  const [place, setPlace] = useState<{ top: number; left: number; width: number } | null>(null);

  // Closes with the list (the row unmounts), and on scroll or resize, where
  // a fixed card would be left in the wrong place.
  useEffect(() => {
    if (!place) return;
    const close = () => setPlace(null);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [place]);

  if (!info) return null;

  // Beside the list, on whichever side has room; on a phone, where neither
  // does, under the row across the screen.
  const show = () => {
    const icon = iconRef.current;
    if (!icon) return;
    const row = icon.closest("[data-slot=select-item]")?.getBoundingClientRect() ?? icon.getBoundingClientRect();
    const list = icon.closest("[role=listbox]")?.getBoundingClientRect() ?? row;
    const vw = window.innerWidth;
    const width = Math.min(CARD_WIDTH, vw - 2 * GAP);
    if (list.left - GAP - width >= GAP) setPlace({ top: row.top, left: list.left - GAP - width, width });
    else if (list.right + GAP + width <= vw - GAP) setPlace({ top: row.top, left: list.right + GAP, width });
    else setPlace({ top: row.bottom + GAP, left: Math.max(GAP, (vw - width) / 2), width });
  };

  const stop = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <>
      <span
        ref={iconRef}
        aria-hidden="true"
        data-vat-info={rate}
        onPointerEnter={(event) => event.pointerType === "mouse" && show()}
        onPointerLeave={(event) => event.pointerType === "mouse" && setPlace(null)}
        onPointerDown={stop}
        onPointerUp={stop}
        onClick={(event) => {
          stop(event);
          // A tap toggles; a mouse already opened it on hover.
          if (place) setPlace(null);
          else show();
        }}
        className="ml-0.5 inline-flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full text-gray-400 transition-colors hover:text-[#DC3173] data-[open=true]:text-[#DC3173]"
        data-open={place ? "true" : undefined}
      >
        <Info className="h-3.5 w-3.5 text-current" />
      </span>

      {/* For screen readers and keyboard users: the row's description. */}
      <span id={describedById} className="sr-only">
        {t(info.title)}. {t(info.body)}
      </span>

      {place
        ? createPortal(
            <div
              role="tooltip"
              style={{ top: place.top, left: place.left, width: place.width }}
              className="pointer-events-none fixed z-[60] rounded-2xl border border-[#DC3173]/15 bg-white p-4 shadow-lg animate-in fade-in-0 zoom-in-95"
            >
              <p className="text-sm font-semibold text-gray-900">{t(info.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{t(info.body)}</p>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
