"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import { ChevronRight, Coins, Gift, UserPlus } from "lucide-react";
import Link from "next/link";

/**
 * The dashboard's way into Rewards (plan.md Phase 6): the balance and two
 * shortcuts. A branch has points but no referrals, so it gets no "Refer & earn".
 */
export default function PointsSummaryCard({ points, isBranch }: { points: number; isBranch: boolean }) {
  const { t } = useTranslation();
  const links = [
    { href: "/vendor/rewards", label: t("loyalty_nav_rewards"), icon: Gift },
    ...(isBranch ? [] : [{ href: "/vendor/referrals", label: t("loyalty_nav_referrals"), icon: UserPlus }]),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#DC3173]/20 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <Link href="/vendor/points" className="group flex min-w-0 items-center gap-3">
        <span className="shrink-0 rounded-xl bg-[#DC3173]/10 p-3 text-[#DC3173]">
          <Coins size={22} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm text-gray-500">{t("loyalty_dashboard_points")}</span>
          <span className="flex items-center gap-1 text-xl font-bold text-gray-900 group-hover:text-[#DC3173]">
            {t(points === 1 ? "loyalty_points_count_one" : "loyalty_points_count_other").replace("{count}", String(points))}
            <ChevronRight className="h-4 w-4 opacity-60" aria-hidden />
          </span>
        </span>
      </Link>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#DC3173]/30 px-4 py-2 text-sm font-medium text-[#DC3173] transition-colors hover:bg-pink-50"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
