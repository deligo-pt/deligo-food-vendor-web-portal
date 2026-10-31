"use client";

import { Switch } from "@/components/ui/switch";
import { getEffectiveSdrDeposit } from "@/src/services/dashboard/sdr/sdr";
import { TAddonOptionSdr } from "@/src/types/add-ons.type";
import { TSdrEffective } from "@/src/types/product.type";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const DEFAULT_ADDON_SDR: TAddonOptionSdr = { applicable: false, containerCount: 1 };

/**
 * An option's SDR as the form sends it. The container count is no longer
 * asked for (31 Oct 2026): every SDR option is one container, so a count
 * stored before (e.g. 2) becomes 1 the next time its group is saved.
 */
export const toAddonSdr = (applicable: boolean): TAddonOptionSdr => ({ applicable, containerCount: 1 });

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
  // One line, for an option already in the list: the switch and the deposit.
  compact?: boolean;
}

/**
 * The SDR switch for one add-on option, styled like the product form's. The
 * vendor decides whether the option carries the deposit; the amount is the
 * admin's, shown read-only.
 */
export default function AddonSdrControl({ id, value, onChange, deposit, t, compact = false }: IProps) {
  const applicable = !!value?.applicable;
  const toggle = (next: boolean) => onChange(toAddonSdr(next));

  // What the customer pays on top of the price, once SDR is on.
  const total = deposit?.isActive ? (
    <span className="text-xs text-gray-500">
      = <span className="whitespace-nowrap font-semibold text-gray-700">+{deposit.depositAmount.toFixed(2)}&nbsp;€</span>{" "}
      {t("sdr_deposit")}
    </span>
  ) : null;

  if (compact) {
    return (
      <div className="flex min-h-7 flex-wrap items-center gap-x-3 gap-y-1.5">
        <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700">
          <Switch
            id={id}
            checked={applicable}
            onCheckedChange={toggle}
            className="scale-90 data-[state=checked]:bg-[#DC3173]"
          />
          SDR
        </label>
        {applicable && total}
      </div>
    );
  }

  return (
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
        checked={applicable}
        onCheckedChange={toggle}
        className="data-[state=checked]:bg-[#DC3173]"
      />
    </div>
  );
}
