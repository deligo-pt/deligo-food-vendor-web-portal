/**
 * No vendor page scrolls sideways on a phone.
 *
 *   pnpm verify:responsive
 *
 * No browser, no network: the layout rules are read off source (comments
 * stripped). The browser audit in `plan.md` (Phase 6) is the real test; this
 * keeps the fixes behind it from quietly coming undone.
 *
 * ## What this defends (7 Oct 2026)
 *
 * A browser audit of all 75 pages at 360–1280px found pages wider than the
 * screen. The dashboard's `<main>` is `overflow-x-hidden`, so there it showed
 * as content cut off at the edge rather than a scrollbar. Causes, one rule each:
 *
 * 1. **The top bar.** On phones the icon group never shrank and pushed the ☰
 *    off screen; on tablets the agreement notice pushed the bar ~244px over.
 * 2. **Tables.** `components/ui/table.tsx` puts `whitespace-nowrap` on every
 *    cell, so every table was wider than a phone (and some than a laptop).
 *    Each table now has a card view below `lg`/`xl` and wraps its text columns.
 * 3. **Badges.** `components/ui/badge.tsx` never shrinks, so a long offer code
 *    stuck out. It's capped where it's used.
 * 4. **Page layouts.** Fixed widths, grids that went multi-column too early
 *    (a 768px tablet leaves ~460px beside the sidebar), and charts in grid
 *    items without `min-w-0`.
 * 5. **Public slide-ins.** Framer `initial={{ x: ±N }}` sat off to the side
 *    until in view, making the whole page swipeable sideways.
 *
 * The shared `table.tsx` and `badge.tsx` were deliberately left alone (8
 * tables and 19 badges use them); their hashes are pinned below. If one has to
 * change, re-run the browser audit on every page that uses it, then update the
 * hash.
 */

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const raw = (file) => readFileSync(join(root, file), "utf8");
const code = (file) =>
  raw(file)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
const filesUnder = (dir) =>
  readdirSync(join(root, dir)).flatMap((name) => {
    const path = join(dir, name);
    return statSync(join(root, path)).isDirectory() ? filesUnder(path) : path.endsWith(".tsx") ? [path] : [];
  });

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

const D = "src/components/Dashboard";

section("1. Top bar");
{
  const bar = code("src/components/vendorDashboardSidebar/vendorDashboardSidebar.tsx");
  check(
    "🔴 the phone ☰ never shrinks",
    /aria-label="Menu"[\s\S]{0,120}?className="[^"]*\bshrink-0\b/.test(bar),
  );
  check("the icon group can't push it out (min-w-0 logo side)", /<div className="flex min-w-0 items-center gap-2">/.test(bar));
  check("the logo text hides below 400px", /className="hidden min-\[400px\]:block truncate/.test(bar));
  const icons = code("src/components/vendorTopbar/TopbarIcons.tsx");
  check("🔴 the agreement notice is in the bar from xl only", /<p className="hidden xl:block max-w-\[28rem\] truncate/.test(icons));
  check("below xl it's in the profile menu", /className="xl:hidden[^"]*"[\s\S]{0,200}t\("please_visit_profile_page"\)/.test(icons));
}

section("2. Tables: a card view, and wrapping text columns");
{
  const card = code("src/components/MobileRowCard/MobileRowCard.tsx");
  check(
    "the switch classes are full strings Tailwind can see",
    /lg: "hidden lg:block print:block"/.test(card) &&
      /xl: "hidden xl:block print:block"/.test(card) &&
      /lg: "lg:hidden print:hidden space-y-3"/.test(card) &&
      /xl: "xl:hidden print:hidden space-y-3"/.test(card),
  );
  check("card text wraps (wrap-anywhere)", (card.match(/wrap-anywhere/g) || []).length >= 3);

  // [where the table takes over, how many text columns wrap]
  const TABLES = {
    "Orders/OrderTable.tsx": ["xl", 4], // customer, items, hour, status
    "Reports/SalesReport/SalesReportOrderTable.tsx": ["xl", 2], // customer, items
    "BranchManagement/BranchTable.tsx": ["xl", 3], // branch, manager, email
    "Payments/Transactions/TransactionTable.tsx": ["xl", 1], // description
    "Payments/Payouts/PayoutTable.tsx": ["lg", 1], // method
    "Reports/CustomerReport/CustomerReportTable.tsx": ["lg", 1], // customer
    "SOS/AllSosAlerts.tsx": ["lg", 2], // partner, issue
  };
  for (const [file, [until, wrapping]] of Object.entries(TABLES)) {
    const src = code(`${D}/${file}`);
    const name = file.split("/").pop().replace(".tsx", "");
    check(
      `🔴 ${name}: cards until ${until}, table from ${until}`,
      new RegExp(`<MobileRowCards until="${until}">`).test(src) &&
        new RegExp(`className=\\{TABLE_FROM\\.${until}\\}`).test(src) &&
        !/className="hidden (md|lg|xl):block/.test(src),
    );
    const wraps = (src.match(/<TableCell className="[^"]*whitespace-normal/g) || []).length;
    check(`${name}: its ${wrapping} text column(s) wrap`, wraps >= wrapping, wraps);
    check(
      `${name}: no flex on a <th> (it broke the table layout)`,
      !/<TableHead className="[^"]*\bflex\b/.test(src),
    );
  }
}

section("3. Shared table and badge are unchanged");
{
  const PINNED = {
    "components/ui/table.tsx": "7b8c7a952cf49e78aafe5f628c3bd90f7e01bd5602eb5d3650bef5727a8186d7",
    "components/ui/badge.tsx": "e7455feb113b38c59456ba29a9ec264b5ffa1daae8883866332ad637ffd57c31",
  };
  for (const [file, hash] of Object.entries(PINNED)) {
    const actual = createHash("sha256").update(readFileSync(join(root, file))).digest("hex");
    check(`${file} is the audited version`, actual === hash, "changed: re-run the browser audit on its pages, then update the hash");
  }
}

section("4. Badges and names that can be long");
{
  const offers = code(`${D}/Offers/ActiveOffers/ActiveOffers.tsx`);
  check(
    "🔴 the offer code badge is capped and truncates, with the full code as a tooltip",
    /<Badge\s+variant="outline"\s+className="max-w-full min-w-0"\s+title=\{/.test(offers) &&
      /<span className="min-w-0 truncate">\s*\{t\("code"\)\}/.test(offers),
  );
  check("the offer title wraps", /<h2 className="[^"]*wrap-anywhere/.test(offers));
  check("the offer's left column can shrink", /<div className="flex items-start gap-4 min-w-0 md:flex-1">/.test(offers));
  check(
    "All Items: a long category name truncates in the category box",
    /<span className="min-w-0 truncate uppercase tracking-wide" title=\{getCategoryName/.test(code(`${D}/Products/Products.tsx`)),
  );
  check(
    "Branch details: the header wraps and the name can break",
    /<div className="flex flex-wrap items-center gap-4">/.test(code(`${D}/BranchManagement/BranchDetails.tsx`)) &&
      /className="text-2xl font-bold wrap-anywhere"/.test(code(`${D}/BranchManagement/BranchDetails.tsx`)),
  );
  check(
    "StatsCard: a name as the value wraps, the icon keeps its size",
    /<div className="min-w-0">[\s\S]{0,250}wrap-anywhere/.test(code("src/components/StatsCard/StatsCard.tsx")) &&
      /className="shrink-0 p-3/.test(code("src/components/StatsCard/StatsCard.tsx")),
  );
  for (const f of ["ApplyDecrease", "ApplyIncrease"]) {
    const src = code(`${D}/Products/${f}/${f}.tsx`);
    check(`${f}: category and variation names wrap`, (src.match(/tracking-(tight|wide)[^"]*wrap-anywhere/g) || []).length >= 2);
  }
}

section("5. Page layouts");
{
  const addons = code(`${D}/AddOns/AddOns.tsx`);
  check("Add-ons: group header and option rows wrap", /flex flex-wrap items-center justify-between gap-3 p-5/.test(addons) && /flex flex-wrap items-center justify-between gap-3 p-4/.test(addons));
  check("Categories: the actions wrap under the name", /flex min-w-0 flex-1 basis-48/.test(code(`${D}/ProductCategories/AllProductCategories.tsx`)));
  check("Reviews: the filter buttons wrap", /<div className="flex flex-wrap gap-2 sm:gap-3">/.test(code(`${D}/Reviews/CustomerReviews.tsx`)));
  check("Rating summary: chart cards are min-w-0", (code(`${D}/Reviews/RatingSummary.tsx`).match(/className="min-w-0 bg-white rounded-2xl/g) || []).length >= 2);
  const tax = code(`${D}/Reports/TaxReport/TaxReport.tsx`);
  check("Tax report: stat cards are 3 columns from lg", /grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8/.test(tax) && !/md:grid-cols-3/.test(tax));
  check("🔴 Tax report: no bare col-span-2 (an implicit column on phones)", !/[\s"]col-span-2/.test(tax));
  check("Tax report: chart cards are min-w-0", (tax.match(/className="min-w-0 /g) || []).length >= 3);
  check("Transaction details: label above value on phones", /flex flex-col gap-1 sm:flex-row/.test(code(`${D}/Payments/Transactions/TransactionDetails.tsx`)));
  const cat = code(`${D}/ProductCategories/CategoryDetails.tsx`);
  check("Category details: two columns from lg", /grid grid-cols-1 lg:grid-cols-3/.test(cat) && !/md:col-span-2/.test(cat));

  // A fixed minimum wider than a phone can't fit anywhere in the dashboard.
  const wide = [...filesUnder(D), ...filesUnder("src/app/(vendorDashboard)")].flatMap((f) =>
    [...code(f).matchAll(/min-w-\[(\d+)px\]/g)].filter((m) => Number(m[1]) >= 320).map((m) => `${relative(root, join(root, f))}: ${m[0]}`),
  );
  check("🔴 no fixed min-width of 320px+ in the dashboard", wide.length === 0, wide.join(", "));
}

section("6. Public pages");
{
  // Every slide-in from the side is inside a section that clips it: one
  // `overflow-x-clip` per section with slide-ins (a new page needs at least one).
  const CLIPPED_SECTIONS = { "about-us": 2, "contact-us": 1, security: 1, "tools/manage-products": 1 };
  const slideIns = filesUnder("src/app/(public)").filter((f) => /initial=\{\{[^}]*\bx:\s*-?[1-9]/.test(code(f)));
  check("the slide-in pages are found", slideIns.length >= 4, slideIns.length);
  for (const f of slideIns) {
    const page = f.replace("src/app/(public)/", "").replace("/page.tsx", "");
    const clips = (code(f).match(/overflow-x-clip/g) || []).length;
    check(`🔴 ${page}: slide-ins are clipped`, clips >= (CLIPPED_SECTIONS[page] ?? 1), clips);
  }
  const stepper = code("src/components/Stepper/Stepper.tsx");
  check("🔴 Become a vendor: steps share the width", /flex flex-1 min-w-0 flex-col items-center/.test(stepper) && !/min-w-\[120px\]/.test(stepper));
  check(
    "Live chat: a pasted link breaks inside its bubble",
    /max-w-\[70%\] p-4 rounded-2xl wrap-anywhere/.test(code("src/app/(public)/live-chat/page.tsx")),
  );
  check("the footer's social row wraps", /<div className="flex flex-wrap gap-5 items-center">/.test(code("src/components/Footer/Footer.tsx")));
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
