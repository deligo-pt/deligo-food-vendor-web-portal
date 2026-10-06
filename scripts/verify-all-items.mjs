/**
 * All Items loads every category, a page at a time as the vendor scrolls.
 *
 *   pnpm verify:all-items
 *
 * No network: `utils/catalogueSections.ts` runs directly, and the page's
 * wiring is read off source (comments stripped).
 *
 * ## What this defends (6 Oct 2026)
 *
 * The page asked for the first 20 products and stopped: a vendor with 184 saw
 * 20, with no way to the rest. The category list was capped at the API's
 * default 10 as well.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const code = (f) =>
  readFileSync(join(root, f), "utf8").replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
const C = await import(join(root, "src/utils/catalogueSections.ts"));

let passed = 0;
let failed = 0;
const check = (name, ok, detail) => {
  if (ok) passed++;
  else failed++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${!ok && detail ? `  → ${detail}` : ""}`);
};
const J = JSON.stringify;

console.log("\n🔴 The model");
{
  const cats = [
    { _id: "b", name: { en: "Burgers", pt: "Hambúrgueres" } },
    { _id: "s", name: { en: "Soups", pt: "Sopas" } },
    { _id: "e", name: { en: "Empty", pt: "Vazia" } },
    { _id: "u", name: { en: "Unknown", pt: "Desconhecida" } },
    { _id: "a", name: { en: "Açorda", pt: "Açorda" } },
  ];
  const ordered = C.orderCategories(cats, "en").map((x) => x._id);
  check("🔴 every category, A–Z by the name read", J(ordered) === J(["a", "b", "e", "s", "u"]), J(ordered));
  check("PT orders by the PT name", J(C.orderCategories(cats.slice(0, 2), "pt").map((x) => x._id)) === J(["b", "s"]));
  check("🔴 a section whose count isn't known yet has more to load", C.hasMore(0, null) === true);
  check("pages of 12", C.CATALOGUE_PAGE_SIZE === 12);
  check(
    "🔴 each request carries the page's search, sort and filter",
    J(C.catalogueQuery({ searchTerm: "x", sortBy: "-createdAt", availability: "IN_STOCK", lang: "pt" }, { category: "b", page: 2, limit: 12 })) ===
      J({ category: "b", page: 2, limit: 12, sortBy: "-createdAt", searchTerm: "x", "stock.availabilityStatus": "IN_STOCK" }),
  );
  check(
    "🔴 a product shifting pages is listed once",
    J(C.appendPage([{ _id: "1" }, { _id: "2" }], [{ _id: "2" }, { _id: "3" }]).map((p) => p._id)) === J(["1", "2", "3"]),
  );
  const owned = new Set(["b"]);
  check("in a category of the vendor's: not Other", C.isOrphan({ category: { _id: "b" } }, owned) === false);
  check("only an additional category of the vendor's: not Other", C.isOrphan({ category: { _id: "x" }, additionalCategories: [{ _id: "b" }] }, owned) === false);
  check("🔴 in none of the vendor's: Other", C.isOrphan({ category: { _id: "x" } }, owned) === true && C.isOrphan({}, owned) === true);
  check("more to load until the count is reached", C.hasMore(12, 20) && !C.hasMore(20, 20));
}

console.log("\n🔴 The page");
const page = code("src/app/(vendorDashboard)/vendor/all-items/page.tsx");
const list = code("src/components/Dashboard/Products/Products.tsx");
const svc = code("src/services/dashboard/products/products.ts");
const cats = code("src/services/dashboard/categories/product-categories.ts");
check("🔴 no fixed first-20 any more", !/limit \|\| 20/.test(page) && !/productsData/.test(page + list));
check("🔴 every category, not the API's default 10", /`\/product-categories\?\$\{query \|\| "limit=500"\}`/.test(cats));
check(
  "🔴 the server sends the total and the first page only, no per-category counts",
  /getCatalogueCounts\(\[\], filters\)/.test(page) && /getCategoryProductsPage\(firstId, 1, filters\)/.test(page) && /orderCategories\(categories, lang\)/.test(page),
);
check("🔴 a new search, sort or filter starts again from the top", /key=\{JSON\.stringify\(filters\)\}/.test(page));
check("🔴 failing counts show the error page, not empty categories", /if \(total === undefined\) return <PageLoadError busy \/>;/.test(page));
check(
  "🔴 pages come through server actions (the browser can't send the httpOnly token)",
  /export const getCategoryProductsPage = async/.test(svc) && /serverRequest\.get\("\/products"/.test(svc) && !/fetchData\(/.test(list),
);
check("counts are sent a few at a time", /const COUNT_BATCH = 6;/.test(svc));
check("🔴 each section loads its next page when its end comes into view", /<LoadMore[\s\S]{0,400}onVisible=\{\(\) => loadNext\(section\.id\)\}/.test(list) && /new IntersectionObserver/.test(list));
check(
  "🔴 a section scrolled past during a jump doesn't load",
  /const delay = entry\.isIntersecting \? DWELL_MS/.test(list) && /const DWELL_MS = 300;/.test(list),
);
check(
  "🔴 a load that throws or never replies becomes Retry, not a stuck loader",
  /const result = await settle\(getCategoryProductsPage\(id, section\.page \+ 1, filters\)\);/.test(list) &&
    /Promise\.race\(\[call, timeout\]\)/.test(list),
);
check(
  "🔴 during a jump only the target category loads",
  /paused=\{jumpTarget !== null && jumpTarget !== section\.id\}/.test(list) && /if \(!el \|\| loading \|\| error \|\| paused\) return;/.test(list),
);
check(
  "🔴 a category scrolled past still finishes loading, behind what's on screen",
  /const delay = entry\.isIntersecting \? DWELL_MS : passed && ANCHORS_SCROLL \? PASSED_DWELL_MS : null;/.test(list) && /const PASSED_DWELL_MS = 1500;/.test(list),
);
check(
  "🔴 nothing on screen moves while products load: no layout animation on the grid",
  !/<motion\.div\s+layout/.test(list) && !/mode="popLayout"/.test(list) && !/\by: 20\b/.test(code("src/components/Dashboard/Products/ProductCard.tsx")),
);
check("no background loading above the vendor where the browser can't anchor the scroll", /CSS\.supports\("overflow-anchor", "auto"\)/.test(list));
check(
  "🔴 categories load by themselves from the start, first pages first, then the rest",
  /const unseen = all\.find\(\(s\) => s\.page === 0 && s\.total !== 0 && open\(s\)\);/.test(list) &&
    /const rest = all\.find\(\(s\) => open\(s\) && hasMore\(s\.items\.length, s\.total\)\);/.test(list) &&
    list.indexOf("const unseen") < list.indexOf("const rest"),
);
check("🔴 a category jumped to goes first", /if \(target && open\(target\) && hasMore\(target\.items\.length, target\.total\)\) return target\.id;/.test(list));
check("one background request at a time, with a pause", /const result = await loadNextRef\.current\(id\);/.test(list) && /await sleep\(BACKGROUND_GAP_MS\);/.test(list));
check("🔴 a 429 backs off instead of piling on", /backoff = Math\.min\(backoff \? backoff \* 2 : 2000, 30_000\);/.test(list));
check("paused while the tab is hidden", /await whenVisible\(\);/.test(list) && /document\.visibilityState === "visible"/.test(list));
check("🔴 capped: a huge catalogue loads the rest on scroll", /if \(loaded >= BACKGROUND_LIMIT\) return;/.test(list) && /const BACKGROUND_LIMIT = 500;/.test(list));
check("not above the vendor where the browser can't anchor the scroll", /const aboveView = \(id: string\) => \{\s*if \(ANCHORS_SCROLL\) return false;/.test(list));
check("one request per section at a time", /inFlight\.current\.has\(id\)/.test(list));
check("🔴 a failed page offers Retry, no automatic retry", /t\("retry"\)/.test(list));
check("🔴 Select all in a category loads the rest of it first", /categoryProducts = await loadAll\(group\.id\);/.test(list));
check(
  "🔴 the box shows \"–\", then a spinner while loading, then the count",
  /<CategoryCount total=\{group\.total\} loading=\{!!group\.section\?\.loading\} t=\{t\} \/>/.test(list) &&
    /if \(total !== null\) return <>\{total\}<\/>;/.test(list) && /animate-spin/.test(list) && />–<\/span>/.test(list),
);
check("a category that turns out empty drops out", /\.filter\(\(s\) => s\.total !== 0\)/.test(list));
check("🔴 unreached categories show skeleton cards, so nothing jumps", /<SkeletonRow \/>/.test(list));
check(
  "🔴 loading starts a screen early, inside whichever element scrolls",
  /rootMargin: `0px 0px \$\{PREFETCH_PX\}px 0px`/.test(list) && /root: getRootRef\.current\(\)/.test(list) && /getRoot=\{activeScroller\}/.test(list),
);
check("Other is looked for once, after the last category", /allSectionsLoaded && other\.status !== "done"/.test(list) && /getOtherProducts\(/.test(list));
check("🔴 after an edit, loaded pages are refreshed in place", /const firstCatalogue = useRef\(catalogue\);/.test(list));
check("delete updates every section the product was in", /setSections\(\(prev\) =>\s*prev\.map\(\(s\) => \(s\.items\.some\(gone\)/.test(list));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
