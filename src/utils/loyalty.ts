/**
 * Reading the points / rewards / referral responses one way everywhere.
 *
 * The server's `message` is only half translated in PT ("Referral Statistics
 * And History carregado com sucesso"), so the pages never show it except
 * where the guide says to (the yearly claim limit, whose message names the
 * limit and the year). Everything else goes through `loyaltyErrorCopyKey`.
 *
 * Pure (type imports only), so server and client code can both use it.
 */

import type {
  TMyPoints,
  TMyReferrals,
  TPointsHistoryItem,
  TReferralSummary,
} from "@/src/types/loyalty.type";

/** A finite number, or 0. */
function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export type TPointsBalance = Required<TMyPoints>;

export function normalizePoints(raw: TMyPoints | null | undefined): TPointsBalance {
  return {
    currentPoints: num(raw?.currentPoints),
    totalEarned: num(raw?.totalEarned),
    totalSpent: num(raw?.totalSpent),
  };
}

/** `"N/A"`, blank or missing all mean "no code yet". */
export function referralCodeOf(raw: TMyReferrals | null | undefined): string | null {
  const code = typeof raw?.myReferralCode === "string" ? raw.myReferralCode.trim() : "";
  return code && code.toUpperCase() !== "N/A" ? code : null;
}

export function normalizeReferralSummary(
  raw: TMyReferrals | null | undefined,
): Required<TReferralSummary> {
  const s = raw?.summary;
  return {
    totalInvites: num(s?.totalInvites),
    successfulInvites: num(s?.successfulInvites),
    pendingInvites: num(s?.pendingInvites),
    pointsPerReferral: num(s?.pointsPerReferral),
    totalPointsEarned: num(s?.totalPointsEarned),
  };
}

/** Folds legacy history types into the current six; anything else is "Other". */
export type TPointsRowKind =
  | "Order"
  | "Referral"
  | "Welcome"
  | "Redeem"
  | "Expired"
  | "Adjustment"
  | "Other";

const ROW_KIND: Record<string, TPointsRowKind> = {
  ORDER: "Order",
  EARN: "Order",
  REFERRAL: "Referral",
  REFERRAL_BONUS: "Referral",
  WELCOME: "Welcome",
  REDEEM: "Redeem",
  EXPIRED: "Expired",
  ADJUSTMENT: "Adjustment",
  REFUND: "Adjustment",
};

export function pointsRowKind(row: Pick<TPointsHistoryItem, "type">): TPointsRowKind {
  return ROW_KIND[String(row.type ?? "").toUpperCase()] ?? "Other";
}

/** Translation key for a history row's label. */
export function pointsRowLabelKey(row: Pick<TPointsHistoryItem, "type">): string {
  return `loyalty_points_type_${pointsRowKind(row).toLowerCase()}`;
}

/**
 * Credits still alive that expire within `days` (default 30). The history has
 * no per-lot remaining amount, so the total is an upper bound: word it as
 * "up to N points".
 */
export function pointsExpiringSoon(
  rows: TPointsHistoryItem[],
  now: Date = new Date(),
  days = 30,
): number {
  const limit = now.getTime() + days * 24 * 60 * 60 * 1000;
  return rows.reduce((sum, row) => {
    const points = num(row.points);
    if (points <= 0 || row.isExpired || !row.expireDate) return sum;
    const at = Date.parse(row.expireDate);
    return Number.isFinite(at) && at > now.getTime() && at <= limit ? sum + points : sum;
  }, 0);
}

/**
 * The failed-request shape `catchAsync` returns: the backend's error body sits
 * in `data`, with `errorKey` (stable) and `errorSources` (per field).
 */
type TFailure = {
  statusCode?: number;
  data?: unknown;
} | null | undefined;

export function errorKeyOf(result: TFailure): string | null {
  const body = result?.data as { errorKey?: unknown } | null | undefined;
  return typeof body?.errorKey === "string" ? body.errorKey : null;
}

/** Field-level validation errors (they carry no `errorKey`), keyed by field. */
export function fieldErrorsOf(result: TFailure): Record<string, string> {
  const body = result?.data as { errorSources?: unknown } | null | undefined;
  const sources = Array.isArray(body?.errorSources) ? body.errorSources : [];
  const out: Record<string, string> = {};
  for (const source of sources) {
    const path = (source as { path?: unknown })?.path;
    const message = (source as { message?: unknown })?.message;
    if (typeof path === "string" && path && typeof message === "string" && !(path in out)) {
      out[path] = message;
    }
  }
  return out;
}

const ERROR_COPY: Record<string, string> = {
  REWARD_PICKUP_DATE_INVALID: "loyalty_error_pickup_date",
  REWARD_PRODUCT_NOT_FOUND: "loyalty_error_reward_unavailable",
  REWARD_NOT_AVAILABLE_FOR_ROLE: "loyalty_error_reward_unavailable",
  INSUFFICIENT_POINTS_BALANCE: "loyalty_error_insufficient_points",
  REWARD_CLAIM_LIMIT_REACHED: "loyalty_error_claim_limit",
  REWARD_CLAIM_CONFLICT: "loyalty_error_claim_conflict",
  COMMON_ACCESS_DENIED: "loyalty_error_access_denied",
  INVALID_REFERRAL_CODE: "loyalty_error_invalid_referral_code",
  SELF_REFERRAL_NOT_ALLOWED: "loyalty_error_self_referral",
  ALREADY_REFERRED: "loyalty_error_already_referred",
};

/** Translation key for a failed loyalty request; generic when unknown. */
export function loyaltyErrorCopyKey(result: TFailure): string {
  const key = errorKeyOf(result);
  if (key && ERROR_COPY[key]) return ERROR_COPY[key];
  if (result?.statusCode === 429) return "loyalty_error_busy";
  return "loyalty_error_generic";
}

/**
 * Only the yearly-limit message is worth showing as the server wrote it: it
 * names the limit and the year, which the API exposes nowhere else.
 */
export function shouldShowServerMessage(result: TFailure): boolean {
  return errorKeyOf(result) === "REWARD_CLAIM_LIMIT_REACHED";
}
