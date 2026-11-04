/**
 * Referral, points and rewards (`POINTS_AND_REWARDS_API_GUIDE`, 4 Nov 2026).
 *
 * Fields are optional on purpose: the guide was written against the backend
 * source, and the live test server has drifted from it twice already. The
 * pages read these through the helpers in `src/utils/loyalty.ts`, which fill
 * the gaps with safe defaults.
 *
 * Who may call what:
 * - points balance, history, catalog, claim → VENDOR and SUB_VENDOR (a branch
 *   has its own balance; it does not share the parent's points);
 * - referral stats → VENDOR only (SUB_VENDOR gets 403).
 */

/** `GET /points/my-points`. A vendor who never earned anything gets zeros. */
export type TMyPoints = {
  currentPoints?: number;
  /** Lifetime credits: orders, welcome, referrals, refunds of cancelled claims. */
  totalEarned?: number;
  /** Lifetime points spent on claims, refunds already subtracted. */
  totalSpent?: number;
};

/**
 * Current history types. Rows older than the points rewrite can carry the
 * legacy `EARN`, `REDEEM`, `REFERRAL_BONUS`, `REFUND`, `ADJUSTMENT`, `OTHER`,
 * hence the open `string`.
 */
export type TPointsHistoryType =
  | "Order"
  | "Referral"
  | "Welcome"
  | "Redeem"
  | "Expired"
  | "Adjustment";

/** One row of `GET /points/my-history` (last 18 months, newest first). */
export type TPointsHistoryItem = {
  _id: string;
  type?: TPointsHistoryType | (string & {});
  /** Signed: positive is a credit, negative a debit (`Redeem`, `Expired`). */
  points?: number;
  /** When this credit expires; `null` on debits and old rows. */
  expireDate?: string | null;
  isExpired?: boolean;
  isPaid?: boolean;
  createdAt?: string;
};

/** `GET /rewards` — already filtered to the `Vendor` catalog by the server. */
export type TReward = {
  _id: string;
  name?: string;
  targetRole?: "Customer" | "Rider" | "Vendor" | (string & {});
  requiredPoints?: number;
  /** Euros paid in cash at the office; `0` means free. */
  cashPrice?: number;
  /** Struck-through reference price when higher than `cashPrice`. */
  regularPrice?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/** `POST /rewards/claim`. The body is strict: no other keys. */
export type TClaimRewardPayload = {
  productId: string;
  /** UTC ISO date-time, must be in the future. */
  scheduledPickupDate: string;
};

export type TRewardClaimStatus = "SCHEDULED" | "COLLECTED" | "CANCELLED" | (string & {});

/** The `201` body of a claim. There is no endpoint to list claims later. */
export type TRewardClaim = {
  _id: string;
  productId?: string;
  pointsSpent?: number;
  /** Euros to pay at the office on pickup. */
  cashAmount?: number;
  status?: TRewardClaimStatus;
  scheduledPickupDate?: string;
  year?: number;
  createdAt?: string;
};

export type TReferralStatus = "PENDING" | "COMPLETED" | "EXPIRED" | (string & {});

/**
 * One invited vendor. `PENDING` until their first completed order, then
 * `COMPLETED` and the referrer is paid.
 */
export type TReferralHistoryItem = {
  id: string;
  /** "DeliGo User" when the friend has no name yet. */
  friendName?: string;
  friendPhoto?: string;
  status?: TReferralStatus;
  /** `0` while pending. */
  pointsEarned?: number;
  date?: string;
};

export type TReferralSummary = {
  totalInvites?: number;
  successfulInvites?: number;
  pendingInvites?: number;
  /** What one completed referral pays a vendor right now — never hard-code it. */
  pointsPerReferral?: number;
  /** Completed referral rewards only (not welcome or order points). */
  totalPointsEarned?: number;
};

/** `GET /referrals/my-referrals` (not paginated). */
export type TMyReferrals = {
  /** `"N/A"` until the profile has a name saved. */
  myReferralCode?: string;
  summary?: TReferralSummary;
  referralHistory?: TReferralHistoryItem[];
};
