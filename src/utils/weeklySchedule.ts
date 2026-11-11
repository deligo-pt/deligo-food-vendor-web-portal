/**
 * Weekly opening schedule helpers (FRONTEND_VENDOR_SCHEDULE_GUIDE).
 *
 * - `weeklySchedule` is the source of truth once a vendor has one; the legacy
 *   `openingHours` / `closingHours` / `closingDays` are a lossy read-only
 *   summary from then on (lunch + dinner reads as 12:00–23:00).
 * - A save replaces the whole week, so always send all seven days
 *   (`normalizeWeek`). A missing weekday would become closed.
 * - Never send `weeklySchedule` and the legacy fields in one request, and
 *   never send the legacy fields to a vendor that has a schedule (409
 *   `SCHEDULE_FORMAT_REQUIRES_UPDATE`).
 * - Display only. Whether the store is open now comes from
 *   `businessDetails.availability`, never from this file.
 *
 * Pure (type imports only), so server and client code can both use it.
 */

import type {
  TClockPeriod,
  TWeekday,
  TWeeklyDaySchedule,
} from "@/src/types/vendor.type";

/** Monday first, the order the editor shows and the order we send. */
export const WEEK: readonly TWeekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Backend limit (guide §5). */
export const MAX_PERIODS_PER_DAY = 4;

/**
 * Panel-only business rules (agreed 10 Nov 2026, the backend does not check
 * them): at most 2 closed days, and at least 6 hours open on each open day,
 * summing every shift.
 */
export const MAX_CLOSED_DAYS = 2;
export const MIN_OPEN_MINUTES_PER_DAY = 6 * 60;

const DAY_MINUTES = 24 * 60;

/** "HH:mm", 00:00–23:59. */
export const OPEN_TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
/** "HH:mm" or "24:00". */
export const CLOSE_TIME_RE = /^(([01]\d|2[0-3]):[0-5]\d|24:00)$/;

/** Minutes after midnight; "24:00" → 1440. `NaN` for anything malformed. */
export function toMinutes(time: string): number {
  if (!CLOSE_TIME_RE.test(time)) return NaN;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** A period that closes earlier than it opens runs past midnight. */
export function isOvernight(period: TClockPeriod): boolean {
  return toMinutes(period.close) < toMinutes(period.open);
}

/** Length of one period in minutes (past-midnight periods counted to their close). */
export function periodMinutes(period: TClockPeriod): number {
  const open = toMinutes(period.open);
  const close = toMinutes(period.close);
  if (Number.isNaN(open) || Number.isNaN(close)) return 0;
  return close >= open ? close - open : DAY_MINUTES - open + close;
}

/** Total open minutes of a day, every shift summed. */
export function dayOpenMinutes(periods: readonly TClockPeriod[]): number {
  return periods.reduce((sum, p) => sum + periodMinutes(p), 0);
}

/** Guide §7: a schedule exists only when the array has at least one entry. */
export function hasSchedule(
  details: { weeklySchedule?: TWeeklyDaySchedule[] | null } | null | undefined,
): details is { weeklySchedule: TWeeklyDaySchedule[] } {
  return Array.isArray(details?.weeklySchedule) && details.weeklySchedule.length > 0;
}

/**
 * All seven days, Monday first, each period's times copied. A weekday missing
 * from the input is closed, as the backend reads it.
 */
export function normalizeWeek(
  schedule: readonly TWeeklyDaySchedule[] | null | undefined,
): TWeeklyDaySchedule[] {
  const byDay = new Map((schedule ?? []).map((d) => [d.day, d.periods]));
  return WEEK.map((day) => ({
    day,
    periods: (byDay.get(day) ?? []).map((p) => ({ open: p.open, close: p.close })),
  }));
}

/**
 * Guide §7 `fromLegacy`: prefill the editor for a vendor still on the legacy
 * hours. No hours means "open all day"; close earlier than open is kept as a
 * past-midnight period.
 */
export function fromLegacy(details: {
  openingHours?: string;
  closingHours?: string;
  closingDays?: string[];
}): TWeeklyDaySchedule[] {
  const closed = new Set(details.closingDays ?? []);
  const period: TClockPeriod =
    details.openingHours && details.closingHours
      ? { open: details.openingHours, close: details.closingHours }
      : { open: "00:00", close: "24:00" };
  return WEEK.map((day) => ({ day, periods: closed.has(day) ? [] : [{ ...period }] }));
}

/** The week the editor starts from: the saved schedule, else the legacy hours. */
export function initialWeek(details: {
  weeklySchedule?: TWeeklyDaySchedule[];
  openingHours?: string;
  closingHours?: string;
  closingDays?: string[];
} | null | undefined): TWeeklyDaySchedule[] {
  if (hasSchedule(details)) return normalizeWeek(details.weeklySchedule);
  return fromLegacy(details ?? {});
}

/** "12:00–16:00, 19:00–23:00", or `closedLabel` for a day with no periods. */
export function formatPeriods(periods: readonly TClockPeriod[], closedLabel: string): string {
  return periods.length ? periods.map((p) => `${p.open}–${p.close}`).join(", ") : closedLabel;
}

function samePeriods(a: readonly TClockPeriod[], b: readonly TClockPeriod[]): boolean {
  return (
    a.length === b.length &&
    a.every((p, i) => p.open === b[i].open && p.close === b[i].close)
  );
}

export type TDayGroup = {
  /** First and last weekday of a run of consecutive days with the same hours. */
  from: TWeekday;
  to: TWeekday;
  periods: TClockPeriod[];
};

/**
 * Consecutive days (Monday first) with identical hours, merged:
 * Mon–Thu lunch + dinner, Fri closed, Sat dinner, Sun closed → 4 groups.
 * The caller translates the day names (`from === to` for a single day).
 */
export function groupDays(schedule: readonly TWeeklyDaySchedule[]): TDayGroup[] {
  const groups: TDayGroup[] = [];
  for (const { day, periods } of normalizeWeek(schedule)) {
    const last = groups[groups.length - 1];
    if (last && samePeriods(last.periods, periods)) last.to = day;
    else groups.push({ from: day, to: day, periods });
  }
  return groups;
}

/** Translation key for a weekday's full name (existing keys: `monday`, …). */
export const dayKey = (day: TWeekday) => day.toLowerCase();
/** Translation key for a weekday's short name (`weekday_short_monday`, …). */
export const dayShortKey = (day: TWeekday) => `weekday_short_${day.toLowerCase()}`;

// ---------------------------------------------------------------------------
// Validation — mirrors the backend rules (guide §5, all confirmed live on
// 10 Nov 2026), plus the two panel rules above.
// ---------------------------------------------------------------------------

export type TScheduleIssue = {
  /**
   * Relative to `weeklySchedule`, in the backend's shape:
   * `"0.periods.1.open"`, `"4.periods"`, or `""` for the whole week.
   * The index is the position in the Monday-first week we send, so it lines
   * up with the server's own paths.
   */
  path: string;
  /** Translation key. */
  key: string;
};

/**
 * Every problem with a week, in order. Expects the Monday-first seven days
 * from `normalizeWeek` (the editor's state).
 */
export function scheduleIssues(week: readonly TWeeklyDaySchedule[]): TScheduleIssue[] {
  const issues: TScheduleIssue[] = [];

  week.forEach(({ periods }, d) => {
    if (periods.length > MAX_PERIODS_PER_DAY) {
      issues.push({ path: `${d}.periods`, key: "schedule_err_max_periods" });
    }

    let formatOk = true;
    periods.forEach((p, i) => {
      const base = `${d}.periods.${i}`;
      if (!OPEN_TIME_RE.test(p.open)) {
        formatOk = false;
        issues.push({ path: `${base}.open`, key: "schedule_err_time_format" });
      }
      if (!CLOSE_TIME_RE.test(p.close)) {
        formatOk = false;
        issues.push({ path: `${base}.close`, key: "schedule_err_time_format" });
      }
      if (p.open && p.open === p.close) {
        issues.push({ path: `${base}.close`, key: "schedule_err_same_time" });
      }
    });
    if (!formatOk) return;

    for (let i = 1; i < periods.length; i++) {
      const prev = periods[i - 1];
      // Only the last period may run past midnight (backend: error on its close).
      if (isOvernight(prev)) {
        issues.push({ path: `${d}.periods.${i - 1}.close`, key: "schedule_err_overnight_not_last" });
        continue;
      }
      // Sorted and non-overlapping; touching (16:00 then 16:00) is allowed.
      if (toMinutes(periods[i].open) < toMinutes(prev.close)) {
        issues.push({ path: `${d}.periods.${i}.open`, key: "schedule_err_overlap" });
      }
    }

    // A past-midnight last period must end by the next day's first opening
    // (Sunday is checked against Monday).
    const last = periods[periods.length - 1];
    const next = week[(d + 1) % week.length]?.periods[0];
    if (
      last &&
      next &&
      isOvernight(last) &&
      OPEN_TIME_RE.test(next.open) &&
      toMinutes(last.close) > toMinutes(next.open)
    ) {
      issues.push({ path: `${d}.periods.${periods.length - 1}.close`, key: "schedule_err_overnight_into_next" });
    }

    // Panel rule: at least 6 h open on an open day.
    if (periods.length && dayOpenMinutes(periods) < MIN_OPEN_MINUTES_PER_DAY) {
      issues.push({ path: `${d}.periods`, key: "schedule_err_min_hours" });
    }
  });

  // Panel rule: at most 2 closed days.
  if (week.filter((d) => d.periods.length === 0).length > MAX_CLOSED_DAYS) {
    issues.push({ path: "", key: "schedule_err_max_closed_days" });
  }

  return issues;
}

/** Issues keyed by path (first per path wins): the editor's `errors` prop. */
export function scheduleErrorMap(week: readonly TWeeklyDaySchedule[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const { path, key } of scheduleIssues(week)) if (!(path in out)) out[path] = key;
  return out;
}

/** Minutes after midnight → "HH:mm" (clamped to 00:00–23:59). */
export function fromMinutes(minutes: number): string {
  const m = Math.max(0, Math.min(DAY_MINUTES - 1, Math.round(minutes)));
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/**
 * A sensible next shift for "Add shift": an hour after the day's last close
 * (or right at it, late in the day), up to three hours, ending by midnight —
 * the vendor adjusts it, past midnight included. `null` only when the day
 * already runs to midnight or past it, where nothing can follow.
 */
export function suggestNextPeriod(periods: readonly TClockPeriod[]): TClockPeriod | null {
  const last = periods[periods.length - 1];
  if (!last) return { open: "12:00", close: "16:00" };
  if (isOvernight(last)) return null;
  const lastClose = toMinutes(last.close);
  if (Number.isNaN(lastClose) || lastClose >= DAY_MINUTES) return null;
  const open = lastClose + 60 < DAY_MINUTES ? lastClose + 60 : lastClose;
  const close = Math.min(open + 3 * 60, DAY_MINUTES);
  return { open: fromMinutes(open), close: close === DAY_MINUTES ? "24:00" : fromMinutes(close) };
}

/**
 * A server error path → the editor's relative path, or `null` when it is not a
 * schedule field. `businessDetails.weeklySchedule.0.periods.1.open` →
 * `0.periods.1.open`; `businessDetails.weeklySchedule` → `""`.
 */
export function schedulePathFromServer(path: string): string | null {
  const prefix = "businessDetails.weeklySchedule";
  if (path === prefix) return "";
  return path.startsWith(`${prefix}.`) ? path.slice(prefix.length + 1) : null;
}

/**
 * Whether the store may save its schedule (FRONTEND_VENDOR_SCHEDULE_GUIDE §5 +
 * Postman "Corrections Request"):
 * - `open`: the profile is not locked (a store still registering).
 * - `granted`: locked, but an admin's PENDING correction request grants
 *   `businessDetails` (which covers `weeklySchedule`) or the field itself. A
 *   grant for only the legacy hours does not cover it.
 * - `locked`: anything else. The backend answers
 *   `VENDOR_UPDATE_LOCKED_CONTACT_SUPPORT`, so the editor is read-only.
 */
export function scheduleEditAccess(store: {
  isUpdateLocked?: boolean;
  correctionRequest?: { status?: string; fields?: string[] } | null;
} | null | undefined): "open" | "granted" | "locked" {
  if (!store?.isUpdateLocked) return "open";
  const grant = store.correctionRequest;
  const covers = (field: string) =>
    field === "businessDetails" ||
    field === "businessDetails.weeklySchedule" ||
    field.startsWith("businessDetails.weeklySchedule.");
  return grant?.status === "PENDING" && (grant.fields ?? []).some(covers) ? "granted" : "locked";
}

/** The request body for a schedule save: only `weeklySchedule`, all seven days. */
export function scheduleSaveBody(week: readonly TWeeklyDaySchedule[]) {
  return { businessDetails: { weeklySchedule: normalizeWeek(week) } };
}
