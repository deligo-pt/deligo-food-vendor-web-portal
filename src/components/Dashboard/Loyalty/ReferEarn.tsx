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
import {
  MobileRowCard,
  MobileRowCards,
  MobileRowEmpty,
  TABLE_FROM,
} from "@/src/components/MobileRowCard/MobileRowCard";
import StatsCard from "@/src/components/StatsCard/StatsCard";
import { Button } from "@/src/components/ui/button";
import { useTranslation } from "@/src/hooks/use-translation";
import type { TMyReferrals, TReferralHistoryItem } from "@/src/types/loyalty.type";
import { countLabel } from "@/src/utils/countLabel";
import { normalizeReferralSummary, referralCodeOf } from "@/src/utils/loyalty";
import { format } from "date-fns";
import { enGB, pt } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Gift,
  Hourglass,
  Share2,
  Store,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * "Refer & earn" (plan.md Phase 2). The vendor's own code to share, how a
 * referral pays, the counts, and who used the code.
 *
 * The points per referral come from the API (`pointsPerReferral`); the admin
 * can change them, so no number is written into the copy.
 */
export default function ReferEarn({ data }: { data: TMyReferrals | null }) {
  const { t } = useTranslation();
  const code = referralCodeOf(data);
  const summary = normalizeReferralSummary(data);
  const history = Array.isArray(data?.referralHistory) ? data.referralHistory : [];

  return (
    <LoyaltyPageShell titleKey="loyalty_nav_referrals" subtitleKey="loyalty_referrals_subtitle">
      <div className="grid gap-6 lg:grid-cols-5">
        <CodeCard code={code} className="lg:col-span-3" />
        <HowItWorks points={summary.pointsPerReferral} className="lg:col-span-2" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatsCard title={t("loyalty_referral_total_invites")} value={summary.totalInvites} icon={Users} />
        <StatsCard title={t("loyalty_referral_successful")} value={summary.successfulInvites} icon={CheckCircle2} delay={0.05} />
        <StatsCard title={t("loyalty_referral_pending")} value={summary.pendingInvites} icon={Hourglass} delay={0.1} />
        <StatsCard title={t("loyalty_referral_points_earned")} value={summary.totalPointsEarned} icon={Gift} delay={0.15} />
      </div>

      <History rows={history} />
    </LoyaltyPageShell>
  );
}

function CodeCard({ code, className = "" }: { code: string | null; className?: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  /** The signup page with the code filled in (read by the form from Phase 5). */
  const inviteLink = () =>
    `${window.location.origin}/become-vendor?ref=${encodeURIComponent(code ?? "")}`;

  const copy = async (text: string, doneKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t(doneKey));
      return true;
    } catch {
      toast.error(t("loyalty_copy_failed"));
      return false;
    }
  };

  const copyCode = async () => {
    if (!code) return;
    if (await copy(code, "loyalty_referral_copied")) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const share = async () => {
    if (!code) return;
    const text = t("loyalty_referral_share_text").replace("{code}", code);
    const url = inviteLink();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "DeliGo", text, url });
        return;
      } catch (err) {
        // Closing the share sheet is not an error worth a toast.
        if ((err as { name?: string })?.name === "AbortError") return;
      }
    }
    await copy(`${text}\n${url}`, "loyalty_referral_link_copied");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-[#DC3173]/20 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-xl bg-[#DC3173]/10 p-3 text-[#DC3173]">
          <UserPlus size={22} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{t("loyalty_referral_code")}</h2>
      </div>

      {code ? (
        <>
          <div className="mt-5 rounded-xl border-2 border-dashed border-[#DC3173]/40 bg-pink-50/60 px-4 py-5 text-center">
            <p
              className="font-mono text-2xl font-bold tracking-[0.2em] text-[#DC3173] wrap-anywhere sm:text-3xl"
              aria-label={t("loyalty_referral_code")}
            >
              {code}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={copyCode}
              className="border-[#DC3173]/40 text-[#DC3173] hover:bg-pink-50 hover:text-[#DC3173]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? t("loyalty_referral_copied") : t("loyalty_referral_copy")}
            </Button>
            <Button type="button" onClick={share} className="bg-[#DC3173] text-white hover:bg-[#c02a64]">
              <Share2 className="h-4 w-4" />
              {t("loyalty_referral_share")}
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{t("loyalty_referral_code_pending")}</p>
        </div>
      )}
    </motion.section>
  );
}

function HowItWorks({ points, className = "" }: { points: number; className?: string }) {
  const { t } = useTranslation();
  const steps = [
    t("loyalty_referral_how_step1"),
    t("loyalty_referral_how_step2"),
    // `points` is 0 only if the API left it out; then say "points" without a number.
    points > 0
      ? t("loyalty_referral_how_step3").replace("{points}", String(points))
      : t("loyalty_referral_how_step3_no_number"),
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-900">{t("loyalty_referral_how_title")}</h2>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DC3173] text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
        <Store className="mt-0.5 h-4 w-4 shrink-0 text-[#DC3173]" />
        {t("loyalty_referral_only_partners")}
      </p>
    </motion.section>
  );
}

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  EXPIRED: "bg-gray-100 text-gray-600 border-gray-200",
};

function StatusBadge({ status }: { status?: string }) {
  const { t } = useTranslation();
  const key = String(status ?? "").toUpperCase();
  const known = key in STATUS_STYLE;
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        known ? STATUS_STYLE[key] : STATUS_STYLE.EXPIRED
      }`}
    >
      {known ? t(`loyalty_referral_status_${key.toLowerCase()}`) : status || "—"}
    </span>
  );
}

function FriendAvatar({ row }: { row: TReferralHistoryItem }) {
  const name = row.friendName?.trim() || "DeliGo";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  if (row.friendPhoto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- any host; not worth an `images` entry
      <img src={row.friendPhoto} alt="" className="h-9 w-9 rounded-full object-cover" />
    );
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DC3173]/10 text-xs font-semibold text-[#DC3173]">
      {initials}
    </span>
  );
}

function History({ rows }: { rows: TReferralHistoryItem[] }) {
  const { t, lang } = useTranslation();
  const date = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    // date-fns rather than `toLocaleDateString`: Chrome's pt-PT turns a short
    // month into "25/10/2026", so EN and PT read differently.
    return Number.isNaN(d.getTime()) ? "—" : format(d, "d MMM yyyy", { locale: lang === "pt" ? pt : enGB });
  };
  const points = (n?: number) =>
    countLabel(t, n ?? 0, "loyalty_points_count_one", "loyalty_points_count_other");
  const name = (row: TReferralHistoryItem) => row.friendName?.trim() || "DeliGo User";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-white p-4 shadow-md md:p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("loyalty_referral_history_title")}</h2>

      <MobileRowCards until="lg">
        {rows.length === 0 && <MobileRowEmpty>{t("loyalty_referral_history_empty")}</MobileRowEmpty>}
        {rows.map((row, i) => (
          <MobileRowCard
            key={row.id || i}
            leading={<FriendAvatar row={row} />}
            title={name(row)}
            subtitle={date(row.date)}
            aside={<StatusBadge status={row.status} />}
            fields={[{ label: t("loyalty_referral_points_earned"), value: points(row.pointsEarned) }]}
          />
        ))}
      </MobileRowCards>

      <div className={TABLE_FROM.lg}>
        {rows.length === 0 ? (
          <p className="py-6 text-center text-lg text-[#DC3173]">{t("loyalty_referral_history_empty")}</p>
        ) : (
          <Table className="max-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#DC3173]">{t("loyalty_referral_col_partner")}</TableHead>
                <TableHead className="text-[#DC3173]">{t("loyalty_referral_col_date")}</TableHead>
                <TableHead className="text-[#DC3173]">{t("loyalty_referral_col_status")}</TableHead>
                <TableHead className="text-right text-[#DC3173]">{t("loyalty_referral_points_earned")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={row.id || i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FriendAvatar row={row} />
                      <span className="font-medium text-gray-900">{name(row)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{date(row.date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium text-gray-900">{points(row.pointsEarned)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.section>
  );
}
