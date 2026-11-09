"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import { FIRST_ORDER_DEFAULTS } from "@/src/types/offer.type";
import { TOfferForm } from "@/src/validations/offer/offer.validation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock, Sparkles, Store, UserCheck, Wallet } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

interface IProps {
  control: Control<TOfferForm>;
  /** Current value of `isFirstOrder`. */
  enabled: boolean;
  /**
   * Edit mode: an existing offer's first-order status and scope can't change
   * (`FIRST_ORDER_OFFER_SCOPE_IMMUTABLE`), so the switch is read-only. The
   * phone and restore settings stay editable.
   */
  locked?: boolean;
}

const RESTORE_CHOICES = Array.from(
  { length: FIRST_ORDER_DEFAULTS.maxRestoresLimit + 1 },
  (_, n) => n,
);

/**
 * The "First-order offer" block of the offer form (`first-order-offers.md`).
 * A store's welcome offer is always `scope: "VENDOR"` — never a choice here —
 * and is once per customer, funded by the store.
 */
export default function FirstOrderSection({ control, enabled, locked = false }: IProps) {
  const { t } = useTranslation();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5 transition-colors",
        enabled ? "border-pink-200 bg-pink-50/60" : "border-gray-200 bg-white",
      )}
    >
      <FormField
        control={control}
        name="isFirstOrder"
        render={({ field }) => (
          <FormItem className="flex items-start gap-3 space-y-0">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
              <Sparkles size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <FormLabel
                htmlFor="isFirstOrder"
                className="font-semibold text-gray-800 cursor-pointer"
              >
                {t("first_order_switch_title")}
              </FormLabel>
              <p className="mt-1 text-sm text-gray-500">{t("first_order_switch_desc")}</p>
            </div>
            <FormControl>
              {locked ? (
                <span
                  className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500"
                  title={t("first_order_scope_readonly")}
                >
                  <Lock size={14} />
                </span>
              ) : (
                <Switch
                  id="isFirstOrder"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1 data-[state=checked]:bg-[#DC3173]"
                />
              )}
            </FormControl>
          </FormItem>
        )}
      />

      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 sm:pl-14">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-pink-200 px-3 py-1 text-xs font-medium text-pink-700">
                  <UserCheck size={14} />
                  {t("first_order_once_per_customer")}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-pink-200 px-3 py-1 text-xs font-medium text-pink-700"
                  title={t("first_order_scope_readonly")}
                >
                  <Store size={14} />
                  {t("first_order_scope_your_store")}
                </span>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-pink-100 bg-white p-3 text-sm text-gray-600">
                <Wallet size={16} className="mt-0.5 shrink-0 text-pink-600" />
                <span>{t("first_order_funding_note")}</span>
              </div>

              <button
                type="button"
                onClick={() => setAdvancedOpen((open) => !open)}
                aria-expanded={advancedOpen}
                className="inline-flex items-center gap-1 text-sm font-medium text-pink-700 hover:text-pink-800"
              >
                {t("first_order_advanced")}
                <ChevronDown
                  size={16}
                  className={cn("transition-transform", advancedOpen && "rotate-180")}
                />
              </button>

              {advancedOpen && (
                <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
                  <FormField
                    control={control}
                    name="requireVerifiedPhone"
                    render={({ field }) => (
                      <FormItem className="flex items-start justify-between gap-4 space-y-0">
                        <div className="min-w-0">
                          <FormLabel htmlFor="requireVerifiedPhone" className="text-sm text-gray-800">
                            {t("first_order_require_phone")}
                          </FormLabel>
                          <p className="mt-1 text-xs text-gray-500">
                            {t("first_order_require_phone_desc")}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            id="requireVerifiedPhone"
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-[#DC3173]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="maxRestores"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 space-y-0">
                        <div className="min-w-0">
                          <FormLabel className="text-sm text-gray-800">
                            {t("first_order_max_restores")}
                          </FormLabel>
                          <p className="mt-1 text-xs text-gray-500">
                            {t("first_order_max_restores_desc")}
                          </p>
                        </div>
                        <Select
                          value={String(field.value ?? FIRST_ORDER_DEFAULTS.maxRestores)}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 w-full sm:w-28 shrink-0 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RESTORE_CHOICES.map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n === 0 ? t("first_order_restores_never") : String(n)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
