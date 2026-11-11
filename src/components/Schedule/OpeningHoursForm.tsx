"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import {
  getStoreForScheduleReq,
  updateWeeklyScheduleReq,
} from "@/src/services/dashboard/schedule/schedule.service";
import type { TVendor, TWeeklyDaySchedule } from "@/src/types/vendor.type";
import { readScheduleFailure } from "@/src/utils/scheduleErrors";
import {
  hasSchedule,
  initialWeek,
  normalizeWeek,
  scheduleEditAccess,
  scheduleErrorMap,
} from "@/src/utils/weeklySchedule";
import {
  ArrowLeft,
  Clock,
  Info,
  Loader2,
  Lock,
  Save,
  Unlock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import WeeklyScheduleEditor from "./WeeklyScheduleEditor";

interface IProps {
  /** The store whose hours are edited: the signed-in store, or one of its branches. */
  store: TVendor;
  /** Shown above the title when editing a branch (e.g. its branch name). */
  subtitle?: string;
  /** A "Back" link, for the branch hours page. */
  backHref?: string;
}

const snapshot = (week: TWeeklyDaySchedule[]) =>
  JSON.stringify(normalizeWeek(week));

/** "Fri 19:00" in the store's own time zone. */
function formatStoreTime(
  iso: string,
  timeZone: string | undefined,
  lang: string,
): string {
  try {
    return new Intl.DateTimeFormat(lang === "pt" ? "pt-PT" : "en-GB", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timeZone || "Europe/Lisbon",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * The Opening Hours page body (FRONTEND_VENDOR_SCHEDULE_GUIDE): loads the
 * store's week (its `weeklySchedule`, else prefilled from the legacy hours),
 * and saves only `weeklySchedule`.
 *
 * The open/closed chip is the backend's live state (`availability`, else
 * `isStoreOpen`); it is never computed from the schedule here.
 */
export default function OpeningHoursForm({
  store: initialStore,
  subtitle,
  backHref,
}: IProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [store, setStore] = useState(initialStore);
  const details = store.businessDetails;
  const [week, setWeek] = useState(() => initialWeek(details));
  // What "Discard" returns to: the stored week, or the legacy prefill.
  const [baseline, setBaseline] = useState(() =>
    snapshot(initialWeek(details)),
  );
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // A save refused as locked turns the page read-only even if the loaded
  // record said otherwise (the lock can be set after the page loaded).
  const [lockedBySave, setLockedBySave] = useState(false);
  const access = lockedBySave ? "locked" : scheduleEditAccess(store);
  const locked = access === "locked";

  const clientErrors = useMemo(() => scheduleErrorMap(week), [week]);
  const errors = { ...serverErrors, ...clientErrors };
  const hasClientErrors = Object.keys(clientErrors).length > 0;
  const onLegacy = !hasSchedule(details);
  const edited = snapshot(week) !== baseline;
  // A store still on legacy hours has never saved a week, so its first save is
  // always possible (it is what switches the store to the new format).
  const dirty = edited || onLegacy;

  // Leaving with unsaved changes (reload, close tab, typed URL).
  useEffect(() => {
    if (!edited || locked) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [edited, locked]);

  const change = (next: TWeeklyDaySchedule[]) => {
    setWeek(next);
    // Server errors describe the week that was sent, not this one.
    if (Object.keys(serverErrors).length) setServerErrors({});
    if (banner) setBanner(null);
  };

  const applyStore = (next: TVendor) => {
    setStore(next);
    const nextWeek = initialWeek(next.businessDetails);
    setWeek(nextWeek);
    setBaseline(snapshot(nextWeek));
  };

  const save = async () => {
    if (hasClientErrors || saving || locked) return;
    setSaving(true);
    setBanner(null);
    const toastId = toast.loading(t("schedule_save"));
    try {
      const result = await updateWeeklyScheduleReq(store.userId, week);
      if (result.success) {
        const savedStore = result.data as TVendor | undefined;
        if (
          savedStore?.businessDetails &&
          hasSchedule(savedStore.businessDetails)
        ) {
          applyStore({
            ...store,
            ...savedStore,
            businessDetails: {
              ...store.businessDetails,
              ...savedStore.businessDetails,
            },
          });
        } else {
          // No schedule echoed back: trust what was sent.
          applyStore({
            ...store,
            businessDetails: {
              ...store.businessDetails!,
              weeklySchedule: normalizeWeek(week),
            },
          });
        }
        setServerErrors({});
        toast.success(t("schedule_saved"), { id: toastId });
        router.refresh();
        return;
      }

      const failure = readScheduleFailure(result, t);
      setServerErrors(failure.fieldErrors);
      if (failure.locked) {
        // Show the stored hours, read-only, under the locked notice.
        setLockedBySave(true);
        setWeek(JSON.parse(baseline));
        setServerErrors({});
      }
      if (failure.reload) {
        // 409: the store already uses the weekly format (saved elsewhere).
        // Load what is stored and keep the editor open on it.
        const fresh = await getStoreForScheduleReq(store.userId);
        if (fresh.success && fresh.data) applyStore(fresh.data as TVendor);
        setBanner(failure.summary);
      }
      toast.error(failure.summary ?? t("schedule_err_generic"), {
        id: toastId,
      });
    } catch {
      toast.error(t("schedule_err_generic"), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const availability = details?.availability;
  const state =
    availability?.state ??
    (details?.isStoreOpen === undefined
      ? undefined
      : details.isStoreOpen
        ? "OPEN"
        : "CLOSED");
  const reopens =
    state !== "OPEN" && availability?.nextOpenAt
      ? t("schedule_reopens_at").replace(
          "{time}",
          formatStoreTime(
            availability.nextOpenAt,
            details?.timezone,
            i18n.language,
          ),
        )
      : null;

  return (
    <div
      // Bottom space so the fixed Save bar (2 rows on a phone) never covers Sunday.
      className={cn("mx-auto max-w-5xl space-y-4 sm:space-y-5", locked ? "pb-6" : "pb-44 sm:pb-28")}
    >
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#DC3173] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("schedule_back")}
        </Link>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
        {/* The icon gives its column back to the text on a phone. */}
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-[#DC3173] sm:flex">
          <Clock className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          {subtitle && (
            <p className="text-sm font-medium text-[#DC3173]">{subtitle}</p>
          )}
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {t("schedule_page_title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("schedule_page_subtitle")}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {t("schedule_timezone_note").replace(
              "{timezone}",
              details?.timezone || "Europe/Lisbon",
            )}
          </p>
        </div>
        {state && (
          <div className="flex basis-full flex-col items-start gap-1 sm:basis-auto sm:items-end">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                state === "OPEN" && "bg-green-50 text-green-700",
                state === "CLOSED" && "bg-gray-100 text-gray-600",
                state === "PAUSED" && "bg-amber-50 text-amber-700",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  state === "OPEN"
                    ? "bg-green-500"
                    : state === "PAUSED"
                      ? "bg-amber-500"
                      : "bg-gray-400",
                )}
              />
              {t(`schedule_status_${state.toLowerCase()}`)}
            </span>
            {reopens && (
              <span className="text-xs text-gray-500">{reopens}</span>
            )}
          </div>
        )}
      </div>

      {banner && (
        <p
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          {banner}
        </p>
      )}

      {/* Locked after approval: the hours are shown, not editable, and there is
          no Save that could only fail (VENDOR_UPDATE_LOCKED_CONTACT_SUPPORT). */}
      {locked && (
        <div
          role="status"
          className="flex flex-wrap items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <Lock className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-amber-900">
              {t("schedule_locked_title")}
            </p>
            <p className="mt-1 text-sm text-amber-800">
              {t("schedule_locked_body")}
            </p>
          </div>
          <Link
            href="/vendor/contact-support"
            className="inline-flex h-9 w-full basis-full items-center justify-center rounded-lg bg-[#DC3173] px-4 text-sm font-medium text-white transition-colors hover:bg-[#c42a66] sm:w-auto sm:basis-auto"
          >
            {t("schedule_locked_contact")}
          </Link>
        </div>
      )}

      {access === "granted" && (
        <p className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <Unlock className="mt-0.5 h-4 w-4 shrink-0" />
          {t("schedule_granted_note")}
        </p>
      )}

      {onLegacy && !locked && (
        <p className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {t("schedule_legacy_note")}
        </p>
      )}

      <WeeklyScheduleEditor
        value={week}
        onChange={change}
        errors={errors}
        disabled={saving || locked}
      />

      {!locked && (
        <>
          {/* Save bar. Fixed, not sticky: the dashboard's <main> has
          overflow-x-hidden, which stops sticky from pinning. The left offsets
          mirror the content column in DesktopSidebar (md:ml-60 lg:ml-[20%]). */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur md:left-60 lg:left-[20%]">
            {/* Phone: the message on its own line, then Discard and Save as 2
                equal buttons. From sm: one row, buttons on the right. */}
            <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-x-3 gap-y-2 px-4 py-3 sm:flex sm:justify-end">
              {(hasClientErrors || edited) && (
                <span
                  role={hasClientErrors ? "alert" : undefined}
                  className={cn(
                    "col-span-2 text-sm sm:mr-auto",
                    hasClientErrors ? "font-medium text-red-600" : "text-gray-500",
                  )}
                >
                  {hasClientErrors ? t("schedule_fix_errors") : t("schedule_unsaved")}
                </span>
              )}
              <button
                type="button"
                disabled={!edited || saving}
                onClick={() => {
                  setWeek(JSON.parse(baseline));
                  setServerErrors({});
                }}
                className="h-11 whitespace-nowrap rounded-xl border border-gray-200 px-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40 sm:border-transparent sm:px-4"
              >
                {/* "Discard" fits a 320 px phone in EN and PT. */}
                <span className="sm:hidden">{t("schedule_discard_short")}</span>
                <span className="hidden sm:inline">{t("schedule_discard")}</span>
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!dirty || saving || hasClientErrors}
                className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#DC3173] px-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c42a66] disabled:pointer-events-none disabled:opacity-50 sm:px-5"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {t("schedule_save")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
