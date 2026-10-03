import { isAxiosError } from "axios";

/** Why a server-side page request failed, reduced to what a page needs. */
export type TPageLoadFailure = {
  /** The backend's rate limiter answered 429 ("Too many requests from this IP"). */
  busy: boolean;
};

/**
 * One line in the server log instead of the whole axios error. The full object,
 * with its config, request and stack, was printed for every failed call. A
 * single 429 burst filled the terminal and hid everything else.
 */
export function logServerError(label: string, err: unknown): TPageLoadFailure {
  if (isAxiosError(err)) {
    const status = err.response?.status;
    const message = (err.response?.data as { message?: string } | undefined)?.message || err.message;
    console.log(`${label}: ${err.config?.method?.toUpperCase() ?? ""} ${err.config?.url ?? ""} → ${status ?? "no response"} ${message}`);
    return { busy: status === 429 };
  }
  console.log(`${label}:`, err);
  return { busy: false };
}
