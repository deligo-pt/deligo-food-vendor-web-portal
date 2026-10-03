"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/src/hooks/use-translation";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  /** The backend answered 429; say so, since waiting is the fix. */
  busy?: boolean;
};

/**
 * Shown in place of a page whose main data failed to load. Before this, the
 * page rendered as if the data were empty (all zeros, "no products"), so a
 * failure looked like real data. "Try again" re-renders the page once. There
 * is no automatic retry: against a 429 it would only add to the load.
 */
export default function PageLoadError({ busy }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [retrying, startRetry] = useTransition();

  return (
    <div
      role="alert"
      className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-[#DC3173]/20 bg-white p-8 text-center shadow-sm"
    >
      <AlertTriangle className="h-10 w-10 text-[#DC3173]" />
      <h2 className="text-lg font-semibold text-gray-900">{t("page_load_failed")}</h2>
      <p className="text-sm text-gray-600">
        {busy ? t("page_load_busy") : t("page_load_failed_body")}
      </p>
      <Button
        onClick={() => startRetry(() => router.refresh())}
        disabled={retrying}
        className="mt-2 bg-[#DC3173] text-white hover:bg-[#bb1f61]"
      >
        <RefreshCw className={retrying ? "animate-spin" : undefined} />
        {t("retry")}
      </Button>
    </div>
  );
}
