/**
 * SDR (container deposit) in the vendor panel — Phases 1–4 of `plan.md`.
 *
 *   npm run verify:sdr
 *
 * No token, no network: source and dictionaries are read (comments stripped),
 * and the catalogue query builder is executed.
 *
 * ## What this defends (16 Oct 2026)
 *
 * - The vendor only decides WHICH products carry the deposit. `sdr` on the
 *   product API is strict (any key but `applicable` → 400) and the amount is
 *   the admin's, so the panel sends `{ applicable }` and nothing else, and
 *   never lets the vendor edit the amount.
 * - Edit Item sends `sdr` only when the switch changed, like the other meta.
 * - The "SDR products only" filter sends `sdr.applicable=true` — checked live:
 *   `=true` returns exactly the flagged products, `=false` does NOT return the
 *   rest, so `false` must never be sent.
 * - Order and payout screens add deposit lines only when there is a deposit,
 *   and the order's Total Amount includes it (confirmed on ORD-M7TBUAAGYB:
 *   items €7.00 + deposit €0.15 = €7.15).
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = (f) => readFileSync(join(root, f), "utf8");
const code = (f) =>
  raw(f).replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

let passed = 0;
let failed = 0;
const check = (name, ok) => {
  if (ok) passed++;
  else failed++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}`);
};

const create = code("src/components/Dashboard/Products/ProductForm.tsx");
const edit = code("src/components/Dashboard/Products/EditProductForm.tsx");
const meta = code("src/components/Dashboard/Products/DeligoMetadata.tsx");
const service = code("src/services/dashboard/sdr/sdr.ts");
const schema = code("src/validations/product/product.validation.ts");
const card = code("src/components/Dashboard/Products/ProductCard.tsx");
const details = code("src/components/Dashboard/Products/ProductDetails.tsx");
const products = code("src/components/Dashboard/Products/Products.tsx");
const itemsPage = code("src/app/(vendorDashboard)/vendor/all-items/page.tsx");
const orderItems = code("src/components/Dashboard/Orders/OrderDetails/OrderItemsTable.tsx");
const orderSummary = code("src/components/Dashboard/Orders/OrderDetails/OrderPricingSummary.tsx");
const payoutTable = code("src/components/Dashboard/Payments/Payouts/PayoutTable.tsx");
const payoutDetails = code("src/components/Dashboard/Payments/Payouts/PayoutDetails.tsx");
const en = raw("src/assets/translations/en.ts");
const pt = raw("src/assets/translations/pt.ts");

console.log("\n🔴 Phase 1 — the vendor flags products, nothing else");
check("🔴 the schema has the switch", /sdrApplicable: z\.boolean\(\)/.test(schema));
check("Add Item starts with the switch off", /sdrApplicable: false,/.test(create));
check(
  "🔴 Add Item sends only `{ applicable }` inside `sdr`",
  /sdr: \{ applicable: data\.sdrApplicable === true \}/.test(create),
);
check(
  "Edit Item starts from the product's own flag",
  /sdrApplicable: prevData\?\.sdr\?\.applicable === true/.test(edit),
);
check(
  "🔴 Edit Item sends `sdr` only when it changed, and only `{ applicable }`",
  /if \(hasChanged\(data\.sdrApplicable === true, prevData\?\.sdr\?\.applicable === true\)\) \{\s*productData\.sdr = \{ applicable: data\.sdrApplicable === true \};/.test(edit),
);
const sdrPayloads = [...create.matchAll(/sdr: \{([^}]*)\}/g), ...edit.matchAll(/productData\.sdr = \{([^}]*)\}/g)].map((m) => m[1]);
check(
  "🔴 no payload ever puts a second key in `sdr` (the API rejects it: 400)",
  sdrPayloads.length >= 2 && sdrPayloads.every((body) => /^\s*applicable: [^,]+$/.test(body)),
);
check(
  "the switch is in the metadata tab, bound to `sdrApplicable`",
  /name="sdrApplicable"/.test(meta) && /id="sdrApplicable"/.test(meta),
);
check(
  "🔴 the amount is read-only — no input or form field for it",
  !/depositAmount/.test(meta.replace(/sdr\.depositAmount\.toFixed\(2\)/g, "")) && !/name="sdrDeposit|name="depositAmount/.test(meta),
);
check(
  "the amount comes from the effective-deposit endpoint, cached",
  /serverCachedGet\("\/sdr-deposits\/effective"/.test(service) && /CACHE_TAGS\.sdr/.test(service),
);
check(
  "a failed read means \"not active\", never a broken form",
  /catch \{\s*return inactive;/.test(service),
);

console.log("\n🔴 Phase 2 — the flag is visible, and the filter only ever asks for `true`");
check("All Items card shows the SDR badge for flagged products", /product\.sdr\?\.applicable &&[\s\S]{0,300}SDR/.test(card));
check("product details shows the badge and a Yes / No line", /product\.sdr\?\.applicable \? t\("yes"\) : t\("no"\)/.test(details));
// The SDR tab (30 Oct 2026) replaced the "SDR products only" filter option.
check("the SDR tab is offered to every vendor (restaurants sell drinks too)", /value: "sdr", label: t\("items_tab_sdr"\)/.test(products) && !/key: "sdr"/.test(products));
check("an old `?sdr=only` link opens the SDR tab", /queries\.sdr === "only"[\s\S]{0,300}params\.set\("tab", "sdr"\)/.test(itemsPage));
const C = await import(join(root, "src/utils/catalogueSections.ts"));
check("🔴 `?tab=sdr` is the `sdrOnly` filter, and only that", JSON.stringify(C.tabFilters("sdr")) === '{"sdrOnly":true}' && C.tabOf({ sdrOnly: true }) === "sdr");
const q = (f) => C.catalogueQuery(f, { page: 1 });
check("🔴 `sdrOnly` sends `sdr.applicable=true`", q({ sdrOnly: true })["sdr.applicable"] === "true");
check(
  "🔴 without it, no `sdr.applicable` at all — `false` is never sent (it does not return the rest)",
  !("sdr.applicable" in q({})) && !("sdr.applicable" in q({ sdrOnly: false })),
);

console.log("\n🔴 Phase 3 — orders");
check(
  "the line deposit shows only when the line has one",
  /item\.sdr\?\.applicable && item\.sdr\.lineTotal > 0 &&/.test(orderItems),
);
check(
  "🔴 the deposit line shows only when the order has one",
  /const sdrAmount = payoutSummary\?\.sdr\?\.amount \|\| 0;/.test(orderSummary) && /\{sdrAmount > 0 && \(/.test(orderSummary),
);
check(
  "🔴 Total Amount = the items formula (unchanged) + the deposit",
  /const itemsTotal =\s*\(payoutSummary\?\.vendor\?\.vendorNetPayout \|\| 0\) \+\s*\(payoutSummary\?\.deliGoCommission\?\.totalDeduction \|\| 0\);/.test(orderSummary) &&
    /formatPrice\(itemsTotal \+ sdrAmount\)/.test(orderSummary),
);

console.log("\nPhase 4 — payouts");
check("the payouts list notes the deposit only when there is one", /\(p\.sdrAmount \?\? 0\) > 0 &&/.test(payoutTable));
check("payout details splits earnings and deposit only when there is one", /\{sdrAmount > 0 && \(/.test(payoutDetails));

console.log("\nEvery label in both languages");
const keys = [
  "sdr_container_deposit", "sdr_helper_active", "sdr_helper_inactive", "items_tab_sdr", "no_sdr_items", "no_sdr_items_body",
  "sdr_deposit", "sdr_items_total", "sdr_incl_deposit", "sdr_payout_earnings", "yes", "no",
];
const missing = keys.filter((k) => !new RegExp(`\\n  ${k}:`).test(en) || !new RegExp(`\\n  ${k}:`).test(pt));
check(`en and pt have every SDR key${missing.length ? ` (missing: ${missing.join(", ")})` : ""}`, missing.length === 0);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
