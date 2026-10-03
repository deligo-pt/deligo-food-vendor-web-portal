/**
 * The dashboard asks the backend for each thing once.
 *
 *   pnpm verify:request-load
 *
 * No token, no network: call sites are read off source (comments stripped),
 * and `logServerError` runs directly.
 *
 * ## What this defends (3 Oct 2026)
 *
 * Opening `/vendor/dashboard` made 12–16 backend calls in a second or two. The
 * backend's per-IP rate limiter answered 429 `RATE_LIMIT_EXCEEDED`, so pages
 * loaded slowly, came up empty, or failed. On the server every vendor shares
 * the Next server's IP, so they all share that limit. Causes, one rule each:
 *
 * 1. **The refresh storm.** `TopbarIcons` called `router.refresh()` twice after
 *    loading the agreement, which re-rendered the layout and page.
 * 2. **The double shell.** The layout rendered a mobile and a desktop copy of
 *    everything, hidden by CSS but still mounted. That meant 4 `TopbarIcons`
 *    and every page component twice.
 * 3. **`/profile` per caller.** The layout and the page each fetched it.
 * 4. **Sequential page loads.** All-items waited on each call in turn, and
 *    fetched `/taxes` it never used.
 * 5. **Silent failure.** A failed call rendered as real, empty data.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const code = (file) =>
  readFileSync(join(root, file), "utf8")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
const count = (text, re) => (text.match(re) || []).length;

let passed = 0;
let failed = 0;
function check(name, condition, detail) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}${detail === undefined ? "" : `  → ${detail}`}`);
  }
}
const section = (title) => console.log(`\n${title}`);

const LAYOUT = "src/app/(vendorDashboard)/layout.tsx";
const SHELL = "src/components/vendorDashboardSidebar/DesktopSidebar.tsx";
const SIDEBAR = "src/components/vendorDashboardSidebar/vendorDashboardSidebar.tsx";
const TOPBAR = "src/components/vendorTopbar/Topbar.tsx";
const ICONS = "src/components/vendorTopbar/TopbarIcons.tsx";
const BELL = "src/components/vendorTopbar/TopbarNotification.tsx";
const PROFILE = "src/services/dashboard/profile/profile.service.ts";
const ALL_ITEMS = "src/app/(vendorDashboard)/vendor/all-items/page.tsx";
const ITEM = "src/app/(vendorDashboard)/vendor/all-items/[id]/page.tsx";
const ADD_ITEM = "src/app/(vendorDashboard)/vendor/add-item/page.tsx";
const REVIEWS = "src/app/(vendorDashboard)/vendor/reviews/page.tsx";
const DASHBOARD = "src/app/(vendorDashboard)/vendor/dashboard/page.tsx";

section("🔴 1. No refresh storm");
{
  const icons = code(ICONS);
  check("🔴 TopbarIcons never calls router.refresh()", !/router\.refresh\(/.test(icons));
}

section("🔴 2. The shell renders once");
{
  const layout = code(LAYOUT);
  check("🔴 the layout renders no Topbar or Sidebar of its own", !/<Topbar\b/.test(layout) && !/<Sidebar\b/.test(layout));
  check("🔴 the layout renders {children} once", count(layout, /\{children\}/g) === 1);
  check("the layout renders one shell", count(layout, /<DesktopSidebar\b/g) === 1);
  check("NotificationToast is mounted once", count(layout, /<NotificationToast\b/g) === 1);

  const shell = code(SHELL);
  check("🔴 the shell is not hidden below md", !/"hidden md:flex/.test(shell));
  check("the shell renders {children} once", count(shell, /\{children\}/g) === 1);
  check("the rail is fixed from md up only", /md:fixed/.test(shell) && !/"h-screen fixed/.test(shell));

  check(
    "🔴 each TopbarIcons says which bar it is in",
    /<TopbarIcons vendor=\{vendor\} place="mobile" \/>/.test(code(SIDEBAR)) &&
      /<TopbarIcons vendor=\{vendor\} place="desktop" \/>/.test(code(TOPBAR)),
  );
  const icons = code(ICONS);
  check(
    "🔴 only the desktop copy, on screen, loads the agreement",
    /const showsAgreement = place === "desktop" && onScreen;/.test(icons) &&
      /if \(!showsAgreement\) return;\s*\(async \(\) => \{\s*try \{\s*const res = await getCurrentAgreementVersion\(\)/.test(icons),
  );
  check("🔴 only the copy on screen loads notifications", /<TopbarNotification active=\{onScreen\} \/>/.test(icons));
  check(
    "🔴 the bell stays idle when hidden",
    /if \(!active\) return;\s*\(\(\) => getNotifications\(\{ limit: 10 \}\)\)\(\);\s*\}, \[active\]\);/.test(code(BELL)),
  );
}

section("🔴 3. One /profile per request");
{
  const profile = code(PROFILE);
  check("🔴 getProfileData is cached per request", /const loadProfile = cache\(async/.test(profile) && /export const getProfileData = async \(\) => loadProfile\(\);/.test(profile));
  check("no page calls /profile directly", !/["'`]\/profile["'`]/.test(code(REVIEWS)) && !/["'`]\/profile["'`]/.test(code(DASHBOARD)));
  check("reviews reads the cached vendor", /await getProfileData\(\)/.test(code(REVIEWS)));
}

section("🔴 4. Pages load side by side");
{
  const allItems = code(ALL_ITEMS);
  check("🔴 all-items waits on one Promise.all", /await Promise\.all\(\[\s*categoriesPromise,/.test(allItems));
  check("🔴 all-items no longer fetches /taxes", !/\/taxes/.test(allItems));
  check("categories start before the vendor is awaited", allItems.indexOf("getAllProductCategoriesReq()") < allItems.indexOf("await getProfileData()"));
  check("item details: product alongside vendor + branches", /await Promise\.all\(\[loadBranches\(\), loadProduct\(\)\]\)/.test(code(ITEM)));
  check("add-item: all four together", /await Promise\.all\(\[\s*getAllProductCategoriesReq\(\),\s*getProfileData\(\)[^\]]*loadAddons\(\),\s*loadTaxes\(\),\s*\]\)/.test(code(ADD_ITEM)));
}

section("🔴 5. A failure says so");
{
  check("🔴 dashboard shows PageLoadError on failure", /if \(failure\) return <PageLoadError busy=\{failure\.busy\} \/>;/.test(code(DASHBOARD)));
  check("🔴 all-items shows PageLoadError on failure", /if \(failure\) return <PageLoadError busy=\{failure\.busy\} \/>;/.test(code(ALL_ITEMS)));
  check("PageLoadError retries only on click", !/useEffect/.test(code("src/components/PageLoadError/PageLoadError.tsx")));

  const { logServerError } = await import(join(root, "src/utils/serverError.ts"));
  const { AxiosError } = await import("axios");
  const quiet = console.log;
  console.log = () => {};
  const rateLimited = new AxiosError("Request failed with status code 429", "ERR_BAD_REQUEST", { url: "/x", method: "get" }, null, {
    status: 429,
    data: { message: "Too many requests from this IP." },
  });
  const notFound = new AxiosError("Request failed with status code 404", "ERR_BAD_REQUEST", { url: "/x", method: "get" }, null, {
    status: 404,
    data: {},
  });
  const busy = logServerError("t", rateLimited).busy;
  const other = logServerError("t", notFound).busy;
  const plain = logServerError("t", new Error("boom")).busy;
  console.log = quiet;
  check("🔴 a 429 is reported as busy", busy === true);
  check("other failures are not", other === false && plain === false);
}

section("🔴 6. Rarely-changing data is cached, and edits clear it");
{
  const cats = code("src/services/dashboard/categories/product-categories.ts");
  const branches = code("src/services/dashboard/branch/branch.service.ts");
  const profile = code(PROFILE);
  const vendor = code("src/services/becomeVendor/become-vendor.ts");
  const docs = code("src/services/becomeVendor/updateDocuments.service.ts");
  const helper = code("lib/serverFetch.ts");

  check(
    "🔴 the category list is cached and tagged",
    /getAllProductCategoriesReq = async[\s\S]*?next: \{\s*revalidate: CACHE_SECONDS\.lists,\s*tags: \[CACHE_TAGS\.productCategories\]/.test(cats),
  );
  check(
    "🔴 every category change expires it at once (updateTag, not stale-while-revalidate)",
    count(cats, /updateTag\(CACHE_TAGS\.productCategories\)/g) === 4 && !/revalidateTag\(/.test(cats),
    "add, update, soft delete, permanent delete",
  );
  check(
    "🔴 branches are cached only when asked (copy targets)",
    /cached \? \{ next: \{ revalidate: CACHE_SECONDS\.lists, tags: \[CACHE_TAGS\.branches\] \} \} : \{\}/.test(branches) &&
      /\{ cached = false \}/.test(branches),
  );
  check(
    "the item pages ask for cached branches; Branch Management doesn't",
    /getAllBranches\(vendorData\.userId, undefined, \{ cached: true \}\)/.test(code(ALL_ITEMS)) &&
      /getAllBranches\(vendorData\?\.userId, undefined, \{ cached: true \}\)/.test(code(ITEM)) &&
      !/cached/.test(code("src/app/(vendorDashboard)/vendor/branches/page.tsx")),
  );
  check("a new branch expires the branch cache", /updateTag\(CACHE_TAGS\.branches\)/.test(branches) && !/revalidateTag\(/.test(branches));
  check(
    "🔴 the profile comes from the cache, both /profile and the branch fallback",
    count(profile, /serverCachedGet\([^)]*PROFILE_CACHE\)/g) === 2 && /revalidate: CACHE_SECONDS\.profile, tags: \[CACHE_TAGS\.profile\]/.test(profile),
  );
  check("a branch skips /profile (403, never cached)", /if \(decoded\?\.role !== USER_ROLE\.SUB_VENDOR\)/.test(profile));
  check(
    "🔴 vendor edits expire the profile",
    count(vendor, /updateTag\(CACHE_TAGS\.profile\)/g) === 3 && count(docs, /updateTag\(CACHE_TAGS\.profile\)/g) === 2,
    "update vendor, submit for approval, sign agreement, document add/delete",
  );
  check(
    "🔴 the cached GET keys on session + language only, not the cookie string",
    /export const serverCachedGet/.test(helper) &&
      /const res = await fetch\(`\$\{backendUrl\}\$\{url\}`, \{\s*headers: \{\s*"Accept-Language": activeLang,\s*\.\.\.\(accessToken && \{ authorization: `Bearer \$\{accessToken\}` \}\),\s*\},\s*next: \{ revalidate, tags \},/.test(helper),
  );
  check(
    "the cached GET keeps the device-logout redirect",
    /res\.status === 401 && body\?\.message === 'You have been logged out from this device\. Please log in again\.'\) \{\s*console\.log\("Unauthorized! Redirecting to login\.\.\."\);\s*redirect\('\/login\?clearSession=true'\);/.test(helper),
  );
}

section("🔴 7. Search / filter / sort: one transition, with a loader");
{
  const nav = code("src/hooks/use-list-navigation.tsx");
  check(
    "🔴 list navigations run in one shared transition",
    /const \[isPending, startTransition\] = useTransition\(\);/.test(nav) &&
      /const push = \(href: string\) => startTransition\(\(\) => router\.push\(href\)\);/.test(nav),
  );
  check("without a provider it is plain router.push", /return shared \?\? \{ push: \(href\) => router\.push\(href\), isPending: false \};/.test(nav));
  check(
    "🔴 the provider sits in the shell, around the page",
    /<ListNavigationProvider>\{children\}<\/ListNavigationProvider>/.test(code(SHELL)),
  );
  for (const f of ["SearchFilter", "AllFilters", "PaginationComponent", "SelectFilter"]) {
    const src = code(`src/components/Filtering/${f}.tsx`);
    check(`🔴 ${f} navigates through it`, /const \{ push \} = useListNavigation\(\);/.test(src) && !/router\.push/.test(src));
  }
  const products = code("src/components/Dashboard/Products/Products.tsx");
  check("🔴 all-items shows a loader while results load", /\{updatingList && \(\s*<div role="status"[\s\S]*?<LoaderCircle[\s\S]*?t\("updating_list"\)/.test(products));
  check("the current list stays, dimmed and inert", /updatingList \? "opacity-50 pointer-events-none" : ""/.test(products));
  check(
    "🔴 products are not fetched by the browser (httpOnly token → 401 → logout)",
    !/fetchData\(\s*["'`]\/products/.test(products),
  );
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
