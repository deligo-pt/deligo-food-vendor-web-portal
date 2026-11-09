/**
 * Offer request errors → translation keys.
 *
 * Every key below was seen live on 9 Nov 2026 or is listed in
 * `first-order-offers.md` §4–5. Branch on `errorKey`, never on `message`.
 *
 * Pure (type imports only), so server and client code can both use it.
 */

import { applyServerFieldErrors, errorKeyOf, errorSourcesOf, type TFailure } from "./apiError";

export const OFFER_ERROR_COPY: Record<string, string> = {
  FIRST_ORDER_OFFER_ADMIN_ONLY: "offer_err_first_order_admin_only",
  ACTIVE_FIRST_ORDER_VENDOR_OFFER_EXISTS: "offer_err_first_order_active_exists",
  FIRST_ORDER_OFFER_SCOPE_IMMUTABLE: "offer_err_first_order_scope_immutable",
  FIRST_ORDER_OFFER_USAGE_CAP_UNSUPPORTED: "offer_err_first_order_usage_cap",
  FLAT_OFFER_MIN_ORDER_TOO_LOW: "offer_err_flat_min_order",
  PERCENT_OFFER_MAX_DISCOUNT_REQUIRED: "offer_err_percent_max_required",
  OFFER_LOCKED_BY_ADMIN: "offer_err_locked_by_admin",
  COMMON_UNAUTHORIZED_ACTION: "offer_err_unauthorized",
  OFFER_CODE_ALREADY_EXISTS: "offer_err_code_exists",
  DUPLICATE_AUTO_APPLY_OFFER: "offer_err_duplicate_auto_apply",
  ACTIVE_OFFER_MUST_BE_DEACTIVATED_BEFORE_DELETING: "offer_err_delete_active",
};

/**
 * Field a known error belongs on, when the backend leaves `path` empty
 * (e.g. a taken code). Keys not listed go to a toast or banner.
 */
export const OFFER_ERROR_FIELD: Record<string, string> = {
  OFFER_CODE_ALREADY_EXISTS: "code",
  FLAT_OFFER_MIN_ORDER_TOO_LOW: "minOrderAmount",
  PERCENT_OFFER_MAX_DISCOUNT_REQUIRED: "maxDiscountAmount",
};

/** Errors the create/edit form answers with a banner and an action, not a toast. */
export const OFFER_BANNER_ERRORS: ReadonlySet<string> = new Set([
  "ACTIVE_FIRST_ORDER_VENDOR_OFFER_EXISTS",
  "DUPLICATE_AUTO_APPLY_OFFER",
]);

/** Translation key for a failed offer request, or `null` when the key is unknown. */
export function offerErrorCopyKey(result: TFailure): string | null {
  const key = errorKeyOf(result);
  return key && OFFER_ERROR_COPY[key] ? OFFER_ERROR_COPY[key] : null;
}

/**
 * Create requests fail Zod validation with English-only field messages and no
 * `errorKey`. For the fields we have copy for, show ours instead.
 */
const FIELD_COPY: Record<string, string> = {
  minOrderAmount: "offer_err_flat_min_order",
  maxDiscountAmount: "offer_err_percent_max_required",
};

/** The offer form fields a server error may be put on. */
export const OFFER_FORM_FIELDS = [
  "title",
  "description",
  "discountValue",
  "maxDiscountAmount",
  "minOrderAmount",
  "scopeProducts",
  "validFrom",
  "expiresAt",
  "code",
  "userUsageLimit",
] as const;

/**
 * Shows a failed create/update on the form: every field error goes on its
 * field (create can fail on several at once), a known `errorKey` with no path
 * goes on the field it belongs to, and whatever is left is returned as one
 * line for a toast. Messages are translation keys where we have copy (the
 * form's `FormMessage` passes them through `t()`), the server text otherwise.
 */
export function reportOfferFailure(
  result: TFailure & { message?: string },
  setError: (name: never, error: { type: string; message: string }) => void,
  t: (key: string) => string,
  fallbackKey = "offer_err_generic",
): string | null {
  const key = errorKeyOf(result);
  const keyCopy = key ? OFFER_ERROR_COPY[key] : undefined;

  // A known key the backend leaves without a path still belongs on a field.
  const keyField = key ? OFFER_ERROR_FIELD[key] : undefined;

  const leftovers = applyServerFieldErrors(result, setError, {
    knownFields: OFFER_FORM_FIELDS,
    fieldMap: keyField ? { "": keyField } : {},
    messageFor: (path, message) => keyCopy ?? FIELD_COPY[path] ?? message,
  });

  if (leftovers.length) return [...new Set(leftovers.map(t))].join(" ");
  // Every error landed on a field: the form already says what is wrong.
  if (errorSourcesOf(result).length) return null;
  return keyCopy ? t(keyCopy) : result?.message || t(fallbackKey);
}
