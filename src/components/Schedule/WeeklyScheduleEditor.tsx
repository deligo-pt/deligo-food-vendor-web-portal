"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import type { TClockPeriod, TWeekday, TWeeklyDaySchedule } from "@/src/types/vendor.type";
import {
  dayKey,
  dayOpenMinutes,
  isOvernight,
  MAX_PERIODS_PER_DAY,
  normalizeWeek,
  suggestNextPeriod,
  WEEK,
} from "@/src/utils/weeklySchedule";
import { AlertCircle, CalendarDays, Copy, Moon, Plus, X } from "lucide-react";
import { useRef } from "react";

interface IProps {
  /** The week, Monday first (see `normalizeWeek`). */
  value: TWeeklyDaySchedule[];
  onChange: (week: TWeeklyDaySchedule[]) => void;
  /**
   * Errors keyed by the backend's relative path (`"0.periods.1.open"`,
   * `"4.periods"`, `""` for the whole week). Values are translation keys
   * (client rules, `scheduleErrorMap`) or server text; both go through `t()`,
   * which returns unknown text unchanged.
   */
  errors?: Record<string, string>;
  disabled?: boolean;
}

const WEEKDAYS: readonly TWeekday[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DEFAULT_PERIOD: TClockPeriod = { open: "09:00", close: "21:00" };

const timeInput =
  "h-10 w-full min-w-0 rounded-lg border bg-white px-2.5 text-sm tabular-nums text-gray-800 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#DC3173]/50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

function hoursLabel(minutes: number): string {
  const h = minutes / 60;
  return Number.isInteger(h) ? String(h) : h.toFixed(1).replace(/\.0$/, "");
}

/**
 * Per-day opening shifts editor (FRONTEND_VENDOR_SCHEDULE_GUIDE): up to 4
 * shifts a day, a past-midnight last shift, "until midnight" as `24:00`.
 * Controlled and display-only: validation is the caller's (`scheduleErrorMap`
 * for live client errors, `readScheduleFailure` for the server's), so the same
 * editor serves the Opening Hours page, branch hours and registration.
 */
export default function WeeklyScheduleEditor({ value, onChange, errors = {}, disabled = false }: IProps) {
  const { t } = useTranslation();
  const week = normalizeWeek(value);

  // A day switched off keeps its shifts here, so switching it back on
  // restores them instead of a default.
  const remembered = useRef<Partial<Record<TWeekday, TClockPeriod[]>>>({});

  const setDay = (index: number, periods: TClockPeriod[]) =>
    onChange(week.map((d, i) => (i === index ? { ...d, periods } : d)));

  const setPeriod = (dayIndex: number, periodIndex: number, patch: Partial<TClockPeriod>) =>
    setDay(
      dayIndex,
      week[dayIndex].periods.map((p, i) => (i === periodIndex ? { ...p, ...patch } : p)),
    );

  const toggleDay = (index: number, open: boolean) => {
    const day = week[index];
    if (!open) {
      remembered.current[day.day] = day.periods;
      setDay(index, []);
      return;
    }
    const firstOpen = week.find((d) => d.periods.length)?.periods;
    const restore = remembered.current[day.day] ?? firstOpen ?? [DEFAULT_PERIOD];
    setDay(index, restore.map((p) => ({ ...p })));
  };

  const copyFrom = (index: number, targets: readonly TWeekday[]) => {
    const source = week[index].periods;
    onChange(
      week.map((d) =>
        targets.includes(d.day) && d.day !== week[index].day
          ? { ...d, periods: source.map((p) => ({ ...p })) }
          : d,
      ),
    );
  };

  const weekError = errors[""];

  return (
    // Sized by its own width (container queries), not the screen's: the same
    // editor sits on a full page and inside the narrow registration card.
    <div className="@container space-y-3">
      {weekError && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {t(weekError)}
        </p>
      )}

      {week.map((day, d) => {
        const isOpen = day.periods.length > 0;
        const dayError = errors[`${d}.periods`];
        const total = dayOpenMinutes(day.periods);
        const next = suggestNextPeriod(day.periods);
        const canAdd = !disabled && day.periods.length < MAX_PERIODS_PER_DAY && !!next;
        const dayName = t(dayKey(day.day));
        const hasDayErrors = !!dayError || Object.keys(errors).some((k) => k.startsWith(`${d}.`));

        return (
          <section
            key={day.day}
            aria-label={dayName}
            className={cn(
              "rounded-2xl border bg-white p-3 transition-colors @md:p-4 @xl:p-5",
              hasDayErrors ? "border-red-300" : isOpen ? "border-gray-200" : "border-dashed border-gray-200 bg-gray-50/70",
            )}
          >
            {/* Day header: name + status switch, total, copy actions */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex min-w-36 items-center gap-3">
                <Switch
                  id={`day-${day.day}`}
                  checked={isOpen}
                  disabled={disabled}
                  onCheckedChange={(checked) => toggleDay(d, checked)}
                  className="data-[state=checked]:bg-[#DC3173]"
                />
                <label htmlFor={`day-${day.day}`} className="cursor-pointer select-none font-semibold text-gray-800">
                  {dayName}
                </label>
              </div>

              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  isOpen ? "bg-pink-50 text-[#DC3173]" : "bg-gray-100 text-gray-500",
                )}
              >
                {isOpen
                  ? t("schedule_hours_total").replace("{hours}", hoursLabel(total))
                  : t("schedule_closed")}
              </span>

              {!disabled && (
                <div className="ml-auto flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => copyFrom(d, WEEKDAYS)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-pink-50 hover:text-[#DC3173]"
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    {t("schedule_copy_weekdays")}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyFrom(d, WEEK)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-pink-50 hover:text-[#DC3173]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {t("schedule_copy_all_days")}
                  </button>
                </div>
              )}
            </div>

            {/* Shifts */}
            {isOpen && (
              <ol className="mt-4 space-y-3">
                {day.periods.map((period, p) => {
                  const base = `${d}.periods.${p}`;
                  const openError = errors[`${base}.open`];
                  const closeError = errors[`${base}.close`];
                  const untilMidnight = period.close === "24:00";
                  const overnight = isOvernight(period);
                  const shiftLabel = `${dayName} · ${p + 1}`;

                  return (
                    <li key={p} className="rounded-xl bg-gray-50 p-3 @xl:bg-transparent @xl:p-0">
                      <div className="grid grid-cols-1 items-end gap-3 @xs:grid-cols-2 @xl:grid-cols-[minmax(0,9rem)_minmax(0,9rem)_1fr]">
                        <label className="block">
                          <span className="mb-1 block text-xs font-medium text-gray-500">{t("schedule_opens")}</span>
                          <input
                            type="time"
                            step={60}
                            required
                            aria-label={`${shiftLabel} ${t("schedule_opens")}`}
                            aria-invalid={!!openError}
                            disabled={disabled}
                            value={period.open}
                            onChange={(e) => setPeriod(d, p, { open: e.target.value })}
                            className={cn(timeInput, openError ? "border-red-400" : "border-gray-300")}
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-xs font-medium text-gray-500">{t("schedule_closes")}</span>
                          {/* A time input can't hold 24:00: "Until midnight" stands for it. */}
                          {untilMidnight ? (
                            <span
                              aria-label={`${shiftLabel} ${t("schedule_closes")}`}
                              className={cn(timeInput, "flex items-center border-gray-200 bg-gray-50 text-gray-600")}
                            >
                              24:00
                            </span>
                          ) : (
                            <input
                              type="time"
                              step={60}
                              required
                              aria-label={`${shiftLabel} ${t("schedule_closes")}`}
                              aria-invalid={!!closeError}
                              disabled={disabled}
                              value={period.close}
                              onChange={(e) => setPeriod(d, p, { close: e.target.value })}
                              className={cn(timeInput, closeError ? "border-red-400" : "border-gray-300")}
                            />
                          )}
                        </label>

                        {/* Options row: its own line on a phone, the third column on desktop. */}
                        <div className="col-span-full flex min-h-10 flex-wrap items-center gap-x-3 gap-y-2 @xl:col-span-1">
                          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                            <Checkbox
                              checked={untilMidnight}
                              disabled={disabled}
                              onCheckedChange={(checked) =>
                                setPeriod(d, p, { close: checked === true ? "24:00" : "23:00" })
                              }
                              className="data-[state=checked]:border-[#DC3173] data-[state=checked]:bg-[#DC3173]"
                            />
                            {t("schedule_until_midnight")}
                          </label>

                          {overnight && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                              <Moon className="h-3.5 w-3.5" />
                              {t("schedule_ends_next_day")}
                            </span>
                          )}

                          {!disabled && (
                            <button
                              type="button"
                              onClick={() => setDay(d, day.periods.filter((_, i) => i !== p))}
                              aria-label={`${t("schedule_remove_shift")} (${shiftLabel})`}
                              title={t("schedule_remove_shift")}
                              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {(openError || closeError) && (
                        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                          {t(openError || closeError)}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}

            {dayError && (
              <p role="alert" className="mt-3 text-xs font-medium text-red-600">
                {t(dayError)}
              </p>
            )}

            {isOpen && canAdd && (
              <button
                type="button"
                onClick={() => next && setDay(d, [...day.periods, next])}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-pink-300 px-3 py-2 text-sm font-medium text-[#DC3173] transition-colors hover:bg-pink-50"
              >
                <Plus className="h-4 w-4" />
                {t("schedule_add_shift")}
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}
