"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether a CSS media query matches. It updates when the window crosses the
 * breakpoint, and is `false` during server rendering and hydration.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Tailwind's `md` breakpoint, where the desktop shell takes over from the mobile bar. */
export const DESKTOP_QUERY = "(min-width: 768px)";
