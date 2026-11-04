/**
 * When a claimed reward can be collected at the DeliGo office.
 *
 * The API only checks that `scheduledPickupDate` is in the future; office
 * hours are the app's to enforce (guide §3.4). These are the same defaults the
 * customer app uses (`deligo-food-e-commerce-web-application/src/lib/rewardPickup.ts`)
 * — weekdays, 10:00 to 18:00 Lisbon time, from tomorrow — so a vendor and a
 * customer are offered the same office hours. Still unconfirmed by the
 * business (4 Nov 2026); change them here only, and in the customer app too.
 *
 * Every date is read on a Lisbon clock, never the browser's.
 */

export const REWARD_PICKUP = {
  /** 0 = Sunday … 6 = Saturday. */
  weekdays: [1, 2, 3, 4, 5],
  openHour: 10,
  /** The office closes at 18:00, so the last slot starts at 17:00. */
  closeHour: 18,
  slotMinutes: 60,
  /** Days from today to the first bookable one (1 = tomorrow). */
  firstDayOffset: 1,
  /** How many bookable days the picker offers. */
  dayCount: 10,
} as const;

const OFFICE_TIME_ZONE = "Europe/Lisbon";

export type CalendarDate = { year: number; month: number; day: number };
export type TimeOfDay = { hours: number; minutes: number };

function zonedParts(instant: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: OFFICE_TIME_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    // Some engines say "24" at midnight.
    hours: read("hour") % 24,
    minutes: read("minute"),
    seconds: read("second"),
  };
}

/** Minutes Lisbon is ahead of UTC at `instant` (DST-aware). */
function offsetMinutes(instant: Date): number {
  const p = zonedParts(instant);
  const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hours, p.minutes, p.seconds);
  return (asIfUtc - Math.floor(instant.getTime() / 1000) * 1000) / 60000;
}

function officeToday(now: Date): CalendarDate {
  const { year, month, day } = zonedParts(now);
  return { year, month, day };
}

function addDays(date: CalendarDate, days: number): CalendarDate {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + days, 12));
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() };
}

function weekdayOf(date: CalendarDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day, 12)).getUTCDay();
}

/** The next `dayCount` office days, from tomorrow. */
export function rewardPickupDays(now: Date = new Date()): CalendarDate[] {
  const today = officeToday(now);
  const weekdays: readonly number[] = REWARD_PICKUP.weekdays;
  const days: CalendarDate[] = [];
  for (let offset = REWARD_PICKUP.firstDayOffset; days.length < REWARD_PICKUP.dayCount; offset++) {
    const date = addDays(today, offset);
    if (weekdays.includes(weekdayOf(date))) days.push(date);
  }
  return days;
}

/** Every slot start in a day: 10:00, 11:00 … 17:00. */
export function rewardPickupTimes(): TimeOfDay[] {
  const times: TimeOfDay[] = [];
  for (let m = REWARD_PICKUP.openHour * 60; m < REWARD_PICKUP.closeHour * 60; m += REWARD_PICKUP.slotMinutes) {
    times.push({ hours: Math.floor(m / 60), minutes: m % 60 });
  }
  return times;
}

/**
 * A Lisbon date and time as the UTC ISO string the claim takes. Two passes,
 * because the chosen day can sit on the other side of a DST change from now.
 */
export function rewardPickupIso(date: CalendarDate, time: TimeOfDay, now: Date = new Date()): string {
  const asIfUtc = Date.UTC(date.year, date.month - 1, date.day, time.hours, time.minutes);
  const provisional = new Date(asIfUtc - offsetMinutes(now) * 60000);
  return new Date(asIfUtc - offsetMinutes(provisional) * 60000).toISOString();
}

export function sameDay(a: CalendarDate | null, b: CalendarDate): boolean {
  return !!a && a.year === b.year && a.month === b.month && a.day === b.day;
}

export function formatTimeOfDay(time: TimeOfDay): string {
  return `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`;
}

const LOCALE = { en: "en-GB", pt: "pt-PT" } as const;

/** A day chip: `{ weekday: "Mon", date: "9 Nov" }`. */
export function formatPickupDay(date: CalendarDate, lang: "en" | "pt") {
  const instant = new Date(Date.UTC(date.year, date.month - 1, date.day, 12));
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(LOCALE[lang], { timeZone: "UTC", ...options }).format(instant).replace(".", "");
  // Built from parts: pt-PT's short forms are "segunda" and "9/11".
  return { weekday: fmt({ weekday: "short" }).slice(0, 3), date: `${date.day} ${fmt({ month: "short" })}` };
}

/** "Monday, 9 November 2026, 10:00" on a Lisbon clock. */
export function formatPickupInstant(iso: string, lang: "en" | "pt"): string {
  const instant = new Date(iso);
  if (Number.isNaN(instant.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE[lang], {
    timeZone: OFFICE_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);
}
