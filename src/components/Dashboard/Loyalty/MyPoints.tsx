"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoyaltyPageShell from "@/src/components/Dashboard/Loyalty/LoyaltyPageShell";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import {
  MobileRowCard,
  MobileRowCards,
  MobileRowEmpty,
  TABLE_FROM,
} from "@/src/components/MobileRowCard/MobileRowCard";
import StatsCard from "@/src/components/StatsCard/StatsCard";
import { useListNavigation } from "@/src/hooks/use-list-navigation";
import { useTranslation } from "@/src/hooks/use-translation";
import type { TMeta } from "@/src/types";
import type { TPointsHistoryItem } from "@/src/types/loyalty.type";
import {
  pointsExpiringSoon,
  pointsRowKind,
  pointsRowLabelKey,
  type TPointsBalance,
  type TPointsRowKind,
} from "@/src/utils/loyalty";
import { format } from "date-fns";
import { enGB, pt } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  CircleMinus,
  CirclePlus,
  Coins,
  Gift,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserPlus,
} from "lucide-react";

/**
 * "My points" (plan.md Phase 3): balance, what changed it, how to earn more.
 *
 * Earning amounts: only the referral one is readable (`pointsPerReferral`,
 * from `my-referrals`, which a branch can't call). Order and welcome come
 * from the guide's defaults and are labelled "may change".
 */
const VENDOR_ORDER_POINTS = 1;
const VENDOR_WELCOME_POINTS = 10;

export default function MyPoints({
  balance,
  history,
  meta,
  pointsPerReferral,
}: {
  balance: TPointsBalance;
  history: TPointsHistoryItem[];
  meta?: TMeta;
  /** `null` for a branch (no referrals) or when it couldn't be read. */
  pointsPerReferral: number | null;
}) {
  const { t } = useTranslation();
  const expiring = pointsExpiringSoon(history);

  return (
    <LoyaltyPageShell titleKey="loyalty_nav_points" subtitleKey="loyalty_points_subtitle">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 rounded-2xl bg-linear-to-br from-[#DC3173] to-[#FF6CAB] p-5 text-white shadow-md lg:col-span-1"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-pink-100">{t("loyalty_current_points")}</p>
              <p className="mt-1 text-4xl font-bold wrap-anywhere">{balance.currentPoints}</p>
            </div>
            <div className="shrink-0 rounded-xl bg-white/20 p-3">
              <Coins size={22} />
            </div>
          </div>
        </motion.div>
        <StatsCard title={t("loyalty_total_earned")} value={balance.totalEarned} icon={TrendingUp} delay={0.05} />
        <StatsCard title={t("loyalty_total_spent")} value={balance.totalSpent} icon={TrendingDown} delay={0.1} />
      </div>

      {expiring > 0 && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{t("loyalty_expiring_soon").replace("{count}", String(expiring))}</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <History rows={history} meta={meta} className="xl:col-span-2" />
        <HowToEarn pointsPerReferral={pointsPerReferral} />
      </div>
    </LoyaltyPageShell>
  );
}

const KIND_ICON: Record<TPointsRowKind, typeof Award> = {
  Order: ShoppingBag,
  Welcome: Sparkles,
  Referral: UserPlus,
  Redeem: Gift,
  Expired: CircleMinus,
  Adjustment: CirclePlus,
  Other: Coins,
};

/** Credits green; claims red; expiry and expired credits grey (lost, not spent). */
function amountClass(row: TPointsHistoryItem): string {
  const points = row.points ?? 0;
  if (pointsRowKind(row) === "Expired" || row.isExpired) return "text-gray-500";
  return points < 0 ? "text-red-600" : "text-emerald-600";
}

function signed(points?: number): string {
  const n = points ?? 0;
  return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : "0";
}

function History({
  rows,
  meta,
  className = "",
}: {
  rows: TPointsHistoryItem[];
  meta?: TMeta;
  className?: string;
}) {
  const { t, lang } = useTranslation();
  // Page changes re-render on the server; dim the old rows meanwhile.
  const { isPending } = useListNavigation();
  const locale = lang === "pt" ? pt : enGB;
  const date = (iso?: string | null) => {
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : format(d, "d MMM yyyy", { locale });
  };
  const expiry = (row: TPointsHistoryItem) => {
    if (row.isExpired) return <span className="text-gray-500">{t("loyalty_expired")}</span>;
    const on = (row.points ?? 0) > 0 ? date(row.expireDate) : null;
    return on ? t("loyalty_expires_on").replace("{date}", on) : "—";
  };
  const label = (row: TPointsHistoryItem) => {
    const Icon = KIND_ICON[pointsRowKind(row)];
    return (
      <span className="flex items-center gap-2">
        <span className="shrink-0 rounded-lg bg-[#DC3173]/10 p-1.5 text-[#DC3173]">
          <Icon size={16} />
        </span>
        <span className="font-medium text-gray-900">{t(pointsRowLabelKey(row))}</span>
      </span>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`rounded-2xl bg-white p-4 shadow-md md:p-6 ${className}`}
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("loyalty_history_title")}</h2>

      <div className={`transition-opacity ${isPending ? "pointer-events-none opacity-50" : ""}`} aria-busy={isPending}>
        <MobileRowCards until="lg">
          {rows.length === 0 && <MobileRowEmpty>{t("loyalty_history_empty")}</MobileRowEmpty>}
          {rows.map((row) => (
            <MobileRowCard
              key={row._id}
              title={label(row)}
              aside={<span className={`text-base font-bold ${amountClass(row)}`}>{signed(row.points)}</span>}
              fields={[
                { label: t("loyalty_col_date"), value: date(row.createdAt) ?? "—" },
                { label: t("loyalty_col_expiry"), value: expiry(row) },
              ]}
            />
          ))}
        </MobileRowCards>

        <div className={TABLE_FROM.lg}>
          {rows.length === 0 ? (
            <p className="py-6 text-center text-lg text-[#DC3173]">{t("loyalty_history_empty")}</p>
          ) : (
            <Table className="max-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#DC3173]">{t("loyalty_col_activity")}</TableHead>
                  <TableHead className="text-[#DC3173]">{t("loyalty_col_date")}</TableHead>
                  <TableHead className="text-[#DC3173]">{t("loyalty_col_expiry")}</TableHead>
                  <TableHead className="text-right text-[#DC3173]">{t("loyalty_points")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{label(row)}</TableCell>
                    <TableCell className="text-gray-600">{date(row.createdAt) ?? "—"}</TableCell>
                    <TableCell className="text-gray-600">{expiry(row)}</TableCell>
                    <TableCell className={`text-right font-bold ${amountClass(row)}`}>{signed(row.points)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {(meta?.totalPage ?? 0) > 1 && (
        <div className="mt-4">
          <PaginationComponent totalPages={meta!.totalPage} />
        </div>
      )}
    </motion.section>
  );
}

function HowToEarn({ pointsPerReferral }: { pointsPerReferral: number | null }) {
  const { t } = useTranslation();
  const plus = (n: number) => t(n === 1 ? "loyalty_points_count_one" : "loyalty_points_count_other").replace("{count}", String(n));
  const ways = [
    { icon: ShoppingBag, label: t("loyalty_earn_order"), value: plus(VENDOR_ORDER_POINTS) },
    { icon: Sparkles, label: t("loyalty_earn_welcome"), value: plus(VENDOR_WELCOME_POINTS) },
    ...(pointsPerReferral && pointsPerReferral > 0
      ? [{ icon: UserPlus, label: t("loyalty_earn_referral"), value: plus(pointsPerReferral) }]
      : []),
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900">{t("loyalty_earn_title")}</h2>
      <ul className="mt-4 space-y-3">
        {ways.map(({ icon: Icon, label, value }) => (
          <li key={label} className="flex items-center gap-3 text-sm">
            <span className="shrink-0 rounded-lg bg-[#DC3173]/10 p-1.5 text-[#DC3173]">
              <Icon size={16} />
            </span>
            <span className="min-w-0 flex-1 text-gray-700">{label}</span>
            <span className="shrink-0 font-semibold text-emerald-600">+{value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">{t("loyalty_earn_note")}</p>
    </motion.section>
  );
}
