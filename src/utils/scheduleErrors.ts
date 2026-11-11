/**
 * Schedule save errors (FRONTEND_VENDOR_SCHEDULE_GUIDE §5).
 *
 * - `400` with no `errorKey`: Zod field errors, `errorSources[].path` like
 *   `businessDetails.weeklySchedule.0.periods.1.open` (English text). The
 *   client checks the same rules first, so these are rare.
 * - `409 SCHEDULE_FORMAT_REQUIRES_UPDATE`: legacy hours sent to a vendor with
 *   a schedule. Nothing was saved; reload the vendor and keep the editor.
 * - `400 CORRECTION_FIELD_OUTSIDE_GRANT`: a locked profile whose support grant
 *   does not cover `businessDetails`.
 * - `VENDOR_UPDATE_LOCKED_CONTACT_SUPPORT`: a locked profile with no grant
 *   ("Vendor profile configuration is locked", seen live 10 Nov 2026 on every
 *   APPROVED store).
 *
 * Branch on `errorKey`, never on `message`. Pure, usable on server and client.
 */

import { errorKeyOf, errorSourcesOf, type TFailure } from "./apiError";
import { schedulePathFromServer } from "./weeklySchedule";

export const SCHEDULE_ERROR_COPY: Record<string, string> = {
  SCHEDULE_FORMAT_REQUIRES_UPDATE: "schedule_err_format_requires_update",
  CORRECTION_FIELD_OUTSIDE_GRANT: "schedule_err_outside_grant",
  VENDOR_UPDATE_LOCKED_CONTACT_SUPPORT: "schedule_err_locked",
};

/** Errors that mean the profile is locked: the page turns read-only. */
export const SCHEDULE_LOCK_ERRORS: ReadonlySet<string> = new Set([
  "VENDOR_UPDATE_LOCKED_CONTACT_SUPPORT",
  "CORRECTION_FIELD_OUTSIDE_GRANT",
]);

/** Errors after which the stored vendor must be read again before retrying. */
export const SCHEDULE_RELOAD_ERRORS: ReadonlySet<string> = new Set([
  "SCHEDULE_FORMAT_REQUIRES_UPDATE",
]);

export type TScheduleFailure = {
  errorKey: string | null;
  /** Editor-relative path (`0.periods.1.open`, `""` = whole week) → message. */
  fieldErrors: Record<string, string>;
  /** One line for a toast or banner, or `null` when every error has a field. */
  summary: string | null;
  /** True when the caller should refetch the vendor (409). */
  reload: boolean;
  /** True when the profile is locked for this field (show the locked notice). */
  locked: boolean;
};

/**
 * Reads a failed schedule save. Field errors keep the server text (it has no
 * key to translate); a known `errorKey` becomes our translated copy.
 */
export function readScheduleFailure(
  result: TFailure & { message?: string },
  t: (key: string) => string,
): TScheduleFailure {
  const errorKey = errorKeyOf(result);
  const keyCopy = errorKey ? SCHEDULE_ERROR_COPY[errorKey] : undefined;
  const fieldErrors: Record<string, string> = {};
  const leftovers: string[] = [];

  if (!keyCopy) {
    for (const { path, message } of errorSourcesOf(result)) {
      const rel = schedulePathFromServer(path);
      if (rel !== null && rel !== "" && !(rel in fieldErrors)) fieldErrors[rel] = message;
      else if (!leftovers.includes(message)) leftovers.push(message);
    }
  }

  const summary = keyCopy
    ? t(keyCopy)
    : leftovers.length
      ? leftovers.join(" ")
      : Object.keys(fieldErrors).length
        ? null
        : result?.message || t("schedule_err_generic");

  return {
    errorKey,
    fieldErrors,
    summary,
    reload: !!errorKey && SCHEDULE_RELOAD_ERRORS.has(errorKey),
    locked: !!errorKey && SCHEDULE_LOCK_ERRORS.has(errorKey),
  };
}
