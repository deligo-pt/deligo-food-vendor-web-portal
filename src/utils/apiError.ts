/**
 * Reading a failed request's body one way everywhere.
 *
 * `catchAsync` hands back the backend's error body in `data`:
 * `{ errorKey?, errorSources: [{ path, message }] }`. Branch on `errorKey`
 * (stable), highlight fields from `errorSources[].path`, and never branch on
 * `message` — it is localized and can change.
 *
 * Pure (type imports only), so server and client code can both use it.
 */

/** The failed-request shape `catchAsync` returns. */
export type TFailure =
  | {
      statusCode?: number;
      data?: unknown;
    }
  | null
  | undefined;

export function errorKeyOf(result: TFailure): string | null {
  const body = result?.data as { errorKey?: unknown } | null | undefined;
  return typeof body?.errorKey === "string" ? body.errorKey : null;
}

/** Every `{ path, message }` the backend sent, in order, path `""` when none. */
export function errorSourcesOf(result: TFailure): { path: string; message: string }[] {
  const body = result?.data as { errorSources?: unknown } | null | undefined;
  const sources = Array.isArray(body?.errorSources) ? body.errorSources : [];
  return sources.flatMap((source) => {
    const path = (source as { path?: unknown })?.path;
    const message = (source as { message?: unknown })?.message;
    return typeof message === "string"
      ? [{ path: typeof path === "string" ? path : "", message }]
      : [];
  });
}

/** Field-level errors keyed by field (first message per field wins). */
export function fieldErrorsOf(result: TFailure): Record<string, string> {
  const out: Record<string, string> = {};
  for (const { path, message } of errorSourcesOf(result)) {
    if (path && !(path in out)) out[path] = message;
  }
  return out;
}

type TSetError = (name: never, error: { type: string; message: string }) => void;

/**
 * Puts each server field error on its form field and returns the messages
 * that have no field to sit on (show those in a toast or banner).
 *
 * - `fieldMap` renames a server path to a form field
 *   (e.g. `{ vendorId: "storeId" }`); a path mapped to `null` is never put on
 *   a field.
 * - `knownFields`, when given, limits highlighting to fields the form has;
 *   anything else is returned instead of being lost on an absent field.
 * - `messageFor(path, message)` lets the caller swap in translated copy
 *   (e.g. for a known `errorKey`); by default the server text is used.
 *
 * Create requests can fail on several fields at once, so every entry is
 * applied, not only the first.
 */
export function applyServerFieldErrors(
  result: TFailure,
  setError: TSetError,
  options: {
    fieldMap?: Record<string, string | null>;
    knownFields?: readonly string[];
    messageFor?: (path: string, message: string) => string;
  } = {},
): string[] {
  const { fieldMap = {}, knownFields, messageFor = (_p, m) => m } = options;
  const leftovers: string[] = [];
  const seen = new Set<string>();

  for (const { path, message } of errorSourcesOf(result)) {
    const mapped = path in fieldMap ? fieldMap[path] : path;
    const text = messageFor(path, message);
    const fits = !!mapped && (!knownFields || knownFields.includes(mapped));

    if (fits && mapped) {
      if (seen.has(mapped)) continue;
      seen.add(mapped);
      setError(mapped as never, { type: "server", message: text });
    } else if (!leftovers.includes(text)) {
      leftovers.push(text);
    }
  }
  return leftovers;
}
