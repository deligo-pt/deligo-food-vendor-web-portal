"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { ReactNode } from "react";

/**
 * The frame shared by the referral, points and rewards pages: the panel's
 * pink title header, then the page's own content. Phases 2–4 fill `children`.
 */
export default function LoyaltyPageShell({
  titleKey,
  subtitleKey,
  children,
}: {
  titleKey: string;
  subtitleKey: string;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen space-y-6">
      <TitleHeader title={t(titleKey)} subtitle={t(subtitleKey)} />
      {children}
    </div>
  );
}
