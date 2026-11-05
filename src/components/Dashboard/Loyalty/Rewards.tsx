"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoyaltyPageShell from "@/src/components/Dashboard/Loyalty/LoyaltyPageShell";
import { Button } from "@/src/components/ui/button";
import { useTranslation } from "@/src/hooks/use-translation";
import { claimRewardReq } from "@/src/services/dashboard/loyalty/loyalty.service";
import type { TReward, TRewardClaim } from "@/src/types/loyalty.type";
import { formatPrice } from "@/src/utils/formatPrice";
import { errorKeyOf, loyaltyErrorCopyKey } from "@/src/utils/loyalty";
import {
  formatPickupDay,
  formatPickupInstant,
  formatTimeOfDay,
  rewardPickupDays,
  rewardPickupIso,
  rewardPickupTimes,
  sameDay,
  type CalendarDate,
  type TimeOfDay,
} from "@/src/utils/rewardPickup";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Coins, Gift, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

/**
 * "Rewards" (plan.md Phase 4): the Vendor catalog and the claim.
 *
 * A claim spends points, so the server is the authority on every rule: the
 * button is disabled below `requiredPoints`, but `INSUFFICIENT_POINTS_BALANCE`
 * is still handled (the balance may be stale, or points may have expired).
 * After any claim attempt that may have changed things, `router.refresh()`
 * reloads the balance and the catalog from the server page.
 *
 * There is no "my claims" API, so a claim is seen afterwards only as a
 * "Reward claimed" row in My points; the confirmation says so.
 */
const euro = (n: number) => `${formatPrice(n)} €`;

export default function Rewards({ rewards, currentPoints }: { rewards: TReward[]; currentPoints: number }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<TReward | null>(null);
  /** Set from a 409 REWARD_CLAIM_LIMIT_REACHED: no more claims this session. */
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const usable = rewards.filter((r) => r && r._id && r.isActive !== false);

  return (
    <LoyaltyPageShell titleKey="loyalty_nav_rewards" subtitleKey="loyalty_rewards_subtitle">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#DC3173]/10 p-3 text-[#DC3173]">
            <Coins size={22} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("loyalty_current_points")}</p>
            <p className="text-2xl font-bold text-gray-900">{currentPoints}</p>
          </div>
        </div>
        <Link href="/vendor/points" className="text-sm font-medium text-[#DC3173] hover:underline">
          {t("loyalty_rewards_see_history")}
        </Link>
      </div>

      {limitMessage && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{limitMessage}</p>
        </div>
      )}

      {usable.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="rounded-full bg-[#DC3173]/10 p-4 text-[#DC3173]">
            <Gift size={28} />
          </div>
          <p className="text-lg font-semibold text-gray-900">{t("loyalty_rewards_empty")}</p>
          <p className="max-w-md text-sm text-gray-500">{t("loyalty_rewards_empty_hint")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {usable.map((reward, i) => (
            <RewardCard
              key={reward._id}
              reward={reward}
              currentPoints={currentPoints}
              blocked={!!limitMessage}
              delay={i * 0.04}
              onClaim={() => setSelected(reward)}
            />
          ))}
        </div>
      )}

      <p className="flex items-start gap-2 text-xs text-gray-500">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#DC3173]" />
        {t("loyalty_rewards_office_note")}
      </p>

      {selected && (
        <ClaimDialog
          reward={selected}
          currentPoints={currentPoints}
          onClose={() => setSelected(null)}
          onLimit={(message) => {
            setLimitMessage(message);
            setSelected(null);
          }}
        />
      )}
    </LoyaltyPageShell>
  );
}

function PriceLine({ reward }: { reward: TReward }) {
  const { t } = useTranslation();
  const cash = reward.cashPrice ?? 0;
  const regular = reward.regularPrice ?? 0;
  return (
    <p className="text-sm text-gray-600">
      {cash > 0 ? t("loyalty_reward_pay_at_office").replace("{amount}", euro(cash)) : t("loyalty_reward_free")}
      {regular > cash && <span className="ml-2 text-gray-400 line-through">{euro(regular)}</span>}
    </p>
  );
}

function RewardCard({
  reward,
  currentPoints,
  blocked,
  delay,
  onClaim,
}: {
  reward: TReward;
  currentPoints: number;
  blocked: boolean;
  delay: number;
  onClaim: () => void;
}) {
  const { t } = useTranslation();
  const required = reward.requiredPoints ?? 0;
  const short = Math.max(0, required - currentPoints);
  const progress = required > 0 ? Math.min(100, (currentPoints / required) * 100) : 100;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="shrink-0 rounded-xl bg-[#DC3173]/10 p-3 text-[#DC3173]">
          <Gift size={22} />
        </div>
        <span className="rounded-full bg-[#DC3173] px-3 py-1 text-sm font-bold text-white whitespace-nowrap">
          {t("loyalty_points_count_other").replace("{count}", String(required))}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900 wrap-anywhere">{reward.name || "—"}</h3>
      <PriceLine reward={reward} />

      <div className="mt-auto pt-4">
        {short > 0 && (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden>
              <div className="h-full rounded-full bg-[#DC3173]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {t("loyalty_reward_need_more").replace("{count}", String(short))}
            </p>
          </>
        )}
        <Button
          type="button"
          onClick={onClaim}
          disabled={short > 0 || blocked}
          className="mt-3 w-full bg-[#DC3173] text-white hover:bg-[#c02a64] disabled:bg-gray-200 disabled:text-gray-500"
        >
          {t("loyalty_reward_claim")}
        </Button>
      </div>
    </motion.article>
  );
}

function ClaimDialog({
  reward,
  currentPoints,
  onClose,
  onLimit,
}: {
  reward: TReward;
  currentPoints: number;
  onClose: () => void;
  onLimit: (message: string) => void;
}) {
  const { t, lang } = useTranslation();
  const language = lang === "pt" ? "pt" : "en";
  const router = useRouter();
  const [days] = useState(() => rewardPickupDays());
  const times = rewardPickupTimes();
  const [day, setDay] = useState<CalendarDate | null>(null);
  const [time, setTime] = useState<TimeOfDay | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [claim, setClaim] = useState<TRewardClaim | null>(null);
  const [retried, setRetried] = useState(false);

  const required = reward.requiredPoints ?? 0;

  const submit = async () => {
    if (!day || !time || pending) return;
    const scheduledPickupDate = rewardPickupIso(day, time);
    // The picker can't make a past time, but a dialog left open overnight could.
    if (new Date(scheduledPickupDate).getTime() <= Date.now()) {
      setError(t("loyalty_error_pickup_date"));
      return;
    }
    setError(null);
    setPending(true);
    const result = await claimRewardReq({ productId: reward._id, scheduledPickupDate });
    setPending(false);

    if (result.success) {
      setClaim((result.data as TRewardClaim) ?? { _id: "", scheduledPickupDate, cashAmount: reward.cashPrice });
      toast.success(t("loyalty_reward_claimed_toast"));
      router.refresh();
      return;
    }

    const key = errorKeyOf(result);
    switch (key) {
      case "REWARD_CLAIM_LIMIT_REACHED": {
        // The server's message names the limit and the year; nothing else does.
        const message = (result.data as { message?: string } | null)?.message || t("loyalty_error_claim_limit");
        onLimit(message);
        return;
      }
      case "REWARD_PRODUCT_NOT_FOUND":
      case "REWARD_NOT_AVAILABLE_FOR_ROLE":
        toast.error(t(loyaltyErrorCopyKey(result)));
        router.refresh();
        onClose();
        return;
      case "INSUFFICIENT_POINTS_BALANCE":
        router.refresh();
        setError(t(loyaltyErrorCopyKey(result)));
        return;
      case "REWARD_CLAIM_CONFLICT":
        // One retry is allowed (guide §5); after that, ask them to try later.
        router.refresh();
        setError(t(retried ? "loyalty_error_generic" : "loyalty_error_claim_conflict"));
        setRetried(true);
        return;
      default:
        setError(t(loyaltyErrorCopyKey(result)));
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {claim ? (
          <>
            <DialogHeader>
              <div className="mx-auto rounded-full bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={28} />
              </div>
              <DialogTitle className="text-center">{t("loyalty_reward_claimed_title")}</DialogTitle>
              <DialogDescription className="text-center">{t("loyalty_reward_claimed")}</DialogDescription>
            </DialogHeader>
            <dl className="space-y-2 rounded-xl bg-gray-50 p-4 text-sm">
              <Row label={t("loyalty_reward_label")} value={reward.name || "—"} />
              <Row
                label={t("loyalty_reward_pickup_on")}
                value={formatPickupInstant(claim.scheduledPickupDate ?? "", language) || "—"}
              />
              <Row
                label={t("loyalty_reward_pay_label")}
                value={(claim.cashAmount ?? reward.cashPrice ?? 0) > 0 ? euro(claim.cashAmount ?? reward.cashPrice ?? 0) : t("loyalty_reward_free")}
              />
              <Row
                label={t("loyalty_reward_points_spent")}
                value={String(claim.pointsSpent ?? required)}
              />
            </dl>
            <p className="text-xs text-gray-500">{t("loyalty_reward_claimed_where")}</p>
            <DialogFooter>
              <Button type="button" onClick={onClose} className="w-full bg-[#DC3173] text-white hover:bg-[#c02a64] sm:w-auto">
                {t("loyalty_done")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("loyalty_reward_confirm_title").replace("{name}", reward.name || "")}</DialogTitle>
              <DialogDescription>{t("loyalty_reward_confirm_intro")}</DialogDescription>
            </DialogHeader>

            <dl className="space-y-2 rounded-xl bg-gray-50 p-4 text-sm">
              <Row label={t("loyalty_reward_costs")} value={<span className="font-semibold text-red-600">−{required}</span>} />
              <Row label={t("loyalty_reward_balance_after")} value={String(Math.max(0, currentPoints - required))} />
              <Row
                label={t("loyalty_reward_pay_label")}
                value={(reward.cashPrice ?? 0) > 0 ? euro(reward.cashPrice ?? 0) : t("loyalty_reward_free")}
              />
            </dl>

            {/* `min-w-0` on both fieldsets: a fieldset is at least as wide as
                its content by default, so the scrolling day row stretched the
                whole dialog past the screen and cut off the summary values. */}
            <fieldset disabled={pending} className="min-w-0">
              <legend className="mb-2 text-sm font-semibold text-gray-900">{t("loyalty_reward_pickup_day")}</legend>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {days.map((date) => {
                  const label = formatPickupDay(date, language);
                  const active = sameDay(day, date);
                  return (
                    <button
                      key={`${date.year}-${date.month}-${date.day}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setDay(date)}
                      className={`flex min-w-16 shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-sm transition-colors ${
                        active ? "border-[#DC3173] bg-[#DC3173] text-white" : "border-gray-200 text-gray-700 hover:border-[#DC3173]/60"
                      }`}
                    >
                      <span className="text-xs capitalize opacity-80">{label.weekday}</span>
                      <span className="font-semibold">{label.date}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset disabled={pending || !day} className="min-w-0">
              <legend className="mb-2 text-sm font-semibold text-gray-900">{t("loyalty_reward_pickup_time")}</legend>
              <div className="grid grid-cols-4 gap-2">
                {times.map((slot) => {
                  const active = !!time && time.hours === slot.hours && time.minutes === slot.minutes;
                  return (
                    <button
                      key={formatTimeOfDay(slot)}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setTime(slot)}
                      className={`rounded-lg border py-2 text-sm font-medium transition-colors disabled:opacity-40 ${
                        active ? "border-[#DC3173] bg-[#DC3173] text-white" : "border-gray-200 text-gray-700 hover:border-[#DC3173]/60"
                      }`}
                    >
                      {formatTimeOfDay(slot)}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-gray-500">{t("loyalty_reward_pickup_hours")}</p>
            </fieldset>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
                {t("cancel")}
              </Button>
              <Button
                type="button"
                onClick={submit}
                disabled={!day || !time || pending}
                className="bg-[#DC3173] text-white hover:bg-[#c02a64]"
              >
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("loyalty_reward_confirm")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-gray-500">{label}</dt>
      <dd className="min-w-0 text-right font-medium text-gray-900 wrap-anywhere">{value}</dd>
    </div>
  );
}
