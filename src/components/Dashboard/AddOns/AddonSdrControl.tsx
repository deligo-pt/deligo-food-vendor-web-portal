"use client";

import { Switch } from "@/components/ui/switch";
import { getEffectiveSdrDeposit } from "@/src/services/dashboard/sdr/sdr";
import { TAddonOptionSdr } from "@/src/types/add-ons.type";
import { TSdrEffective } from "@/src/types/product.type";
import { Loader2, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export const DEFAULT_ADDON_SDR: TAddonOptionSdr = { applicable: false, containerCount: 1 };

/**
 * The SDR deposit in force, read once per sheet. `null` while loading; a
 * failed read answers "not active" (see `getEffectiveSdrDeposit`).
 */
export function useSdrDeposit(enabled = true) {
  const [sdr, setSdr] = useState<TSdrEffective | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    getEffectiveSdrDeposit().then((value) => {
      if (!cancelled) setSdr(value);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return sdr;
}

interface IProps {
  id: string;
  value?: TAddonOptionSdr;
  onChange: (value: TAddonOptionSdr) => void;
  deposit: TSdrEffective | null;
  t: (key: string) => string;
  // One line, for an option already in the list: switch and containers only.
  compact?: boolean;
}

/**
 * The SDR switch for one add-on option, styled like the product form's. The
 * vendor decides whether the option carries the deposit and how many
 * containers it holds; the amount is the admin's, shown read-only.
 */
export default function AddonSdrControl({ id, value, onChange, deposit, t, compact = false }: IProps) {
  const sdr = value ?? DEFAULT_ADDON_SDR;
  const count = sdr.containerCount >= 1 ? sdr.containerCount : 1;

  const setCount = (next: number) =>
    onChange({ ...sdr, containerCount: Math.max(1, Math.min(99, Math.trunc(next) || 1)) });

  const stepper = (
    <div className="inline-flex items-center rounded-md border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setCount(count - 1)}
        disabled={count <= 1}
        aria-label={t("addon_sdr_fewer")}
        className="flex h-7 w-7 items-center justify-center text-gray-600 hover:text-[#DC3173] disabled:opacity-40 disabled:hover:text-gray-600"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        id={`${id}-containers`}
        type="number"
        inputMode="numeric"
        min={1}
        max={99}
        step={1}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        aria-label={t("addon_sdr_containers")}
        className="h-7 w-9 border-x border-gray-200 text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        disabled={count >= 99}
        aria-label={t("addon_sdr_more")}
        className="flex h-7 w-7 items-center justify-center text-gray-600 hover:text-[#DC3173] disabled:opacity-40 disabled:hover:text-gray-600"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  // What the customer pays for this option's containers, once SDR is on.
  const total = deposit?.isActive ? (
    <span className="text-xs text-gray-500">
      = <span className="whitespace-nowrap font-semibold text-gray-700">+{(deposit.depositAmount * count).toFixed(2)}&nbsp;€</span>{" "}
      {t("sdr_deposit")}
    </span>
  ) : null;

  if (compact) {
    return (
      <div className="flex min-h-7 flex-wrap items-center gap-x-3 gap-y-1.5">
        <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700">
          <Switch
            id={id}
            checked={sdr.applicable}
            onCheckedChange={(applicable) => onChange({ ...sdr, applicable })}
            className="scale-90 data-[state=checked]:bg-[#DC3173]"
          />
          SDR
        </label>
        {sdr.applicable && (
          <>
            {stepper}
            <span className="text-xs text-gray-500">{t("addon_sdr_containers").toLowerCase()}</span>
            {total}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {t("sdr_container_deposit")}
          </label>
          <p className="text-xs text-gray-500">
            {deposit === null ? (
              // Loading: a spinner in the line the amount will take,
              // so nothing moves when it arrives.
              <span role="status" aria-live="polite" className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#DC3173]" aria-hidden />
                {t("sdr_loading")}
              </span>
            ) : deposit.isActive ? (
              <>
                {t("addon_sdr_helper_active")}{" "}
                <span className="whitespace-nowrap font-semibold text-gray-700">+{deposit.depositAmount.toFixed(2)}&nbsp;€</span>
              </>
            ) : (
              t("sdr_helper_inactive")
            )}
          </p>
        </div>
        <Switch
          id={id}
          checked={sdr.applicable}
          onCheckedChange={(applicable) => onChange({ ...sdr, applicable })}
          className="data-[state=checked]:bg-[#DC3173]"
        />
      </div>

      {sdr.applicable && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <label htmlFor={`${id}-containers`} className="text-sm text-gray-700">
            {t("addon_sdr_containers")}
          </label>
          {stepper}
          {total}
        </div>
      )}
    </div>
  );
}
