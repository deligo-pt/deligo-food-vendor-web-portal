"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition } from "react";

/**
 * Search, filter and sort changes are URL changes that re-render the page on
 * the server. Since the caching in `cache.const.ts`, only the list itself
 * (e.g. `/products`) is fetched again.
 *
 * They run here as one shared transition, which gives two things:
 * - **`isPending`** for the whole shell, so a list can show a loader while its
 *   new results load. Before, nothing changed on screen for seconds.
 * - **The newest change wins.** A newer navigation supersedes the pending one,
 *   so results of a search typed over don't flash in first.
 *
 * Why not fetch the list in the browser instead: the access token is httpOnly
 * once `proxy.ts` has refreshed it, so the browser can't send it. The client
 * axios (`utils/requests.ts`) would get a 401 and log the vendor out. Server
 * rendering uses the server's cookies, and the proxy keeps the token fresh.
 *
 * Without a provider, `push` is plain `router.push` and `isPending` is false.
 */
type TListNavigation = {
  push: (href: string) => void;
  isPending: boolean;
};

const ListNavigationContext = createContext<TListNavigation | null>(null);

export function ListNavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = (href: string) => startTransition(() => router.push(href));

  return (
    <ListNavigationContext.Provider value={{ push, isPending }}>
      {children}
    </ListNavigationContext.Provider>
  );
}

export function useListNavigation(): TListNavigation {
  const router = useRouter();
  const shared = useContext(ListNavigationContext);
  return shared ?? { push: (href) => router.push(href), isPending: false };
}
