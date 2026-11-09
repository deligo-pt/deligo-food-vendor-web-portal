"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/src/hooks/use-translation";
import { OFFER_ERROR_COPY } from "@/src/utils/offerErrors";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface IProps {
  /** `errorKey` of the failed request (one of `OFFER_BANNER_ERRORS`). */
  errorKey: string;
  /** Offered for `ACTIVE_FIRST_ORDER_VENDOR_OFFER_EXISTS`: save the same offer inactive. */
  onSaveInactive?: () => void;
  busy?: boolean;
}

/**
 * A 409 the vendor has to act on — another first-order offer is active, or an
 * identical auto-apply offer exists — shown above the form's buttons instead of
 * a toast that disappears before it can be read.
 */
export default function OfferErrorBanner({ errorKey, onSaveInactive, busy }: IProps) {
  const { t } = useTranslation();
  const activeExists = errorKey === "ACTIVE_FIRST_ORDER_VENDOR_OFFER_EXISTS";

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-900">
          {t(OFFER_ERROR_COPY[errorKey] ?? "offer_err_generic")}
        </p>
      </div>
      {activeExists && (
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button asChild type="button" variant="outline" className="h-10 bg-white">
            <Link href="/vendor/active-offers">{t("first_order_view_active")}</Link>
          </Button>
          {onSaveInactive && (
            <Button
              type="button"
              className="h-10 text-white"
              style={{ background: "#DC3173" }}
              onClick={onSaveInactive}
              disabled={busy}
            >
              {t("first_order_save_inactive")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
