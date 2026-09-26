/**
 * Copying products to branches.
 *
 *   pnpm verify:product-copy
 *
 * No token and no network: the payload builder runs directly (Node loads the
 * `.ts` helper by stripping its types), and the call sites are read off source.
 *
 * ## Why this exists
 *
 * Every rule this endpoint has fails *quietly*. Nothing here throws, nothing
 * turns red — a wrong id comes back as "products were not found", an
 * unapproved branch is dropped from the copy without a word, and a copy that
 * moved nothing answers **HTTP 200**. The feature can be completely broken and
 * still look like it worked, which is exactly how it shipped the first time:
 * the dialog called `/products/:id/copy-to-branch`, a route that has never
 * existed, and reported "Failed to copy product" to anyone who tried.
 *
 * ## What this defends
 *
 * 1. **The endpoint.** `/products/copy-to-sub-vendors` — plural, and not the
 *    per-product route that 404s.
 * 2. **The two ids, which are asymmetric.** `productIds` takes `PROD-XXXXXX`
 *    and nothing else; `targetSubVendorIds` takes the branch's `_id`.
 *    Verified against the API on 24 Sep 2026.
 * 3. **The exclusive pairs.** `copyAllProducts` with `productIds`, or
 *    `copyToAllTargetSubVendors` with `targetSubVendorIds`, is a 400 whose
 *    wording describes a different problem.
 * 4. **Approved branches only.** An unapproved target is ignored in silence.
 * 5. **`copiedCount: 0` is not a success**, because the API calls it one.
 * 6. **Every string is translated.** `t()` here returns the *key* when it is
 *    missing, so an untranslated string ships as `copy_nothing_new` rather
 *    than as English.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const read = (file) => readFileSync(join(root, file), "utf8");
const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

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

const {
  buildCopyPayload,
  copyBlockedReason,
  describeCopyResult,
  approvedBranches,
  isCopyTarget,
  branchTargetId,
  branchDisplayName,
  productCode,
} = await import(join(root, "src/utils/productCopy.ts"));

const service = stripComments(read("src/services/dashboard/products/products.ts"));
const dialog = stripComments(read("src/components/Dashboard/Products/CopyToBranchDialog.tsx"));
const catalogue = stripComments(read("src/components/Dashboard/Products/Products.tsx"));
const card = stripComments(read("src/components/Dashboard/Products/ProductCard.tsx"));
const details = stripComments(read("src/components/Dashboard/Products/ProductDetails.tsx"));
const itemsPage = stripComments(read("src/app/(vendorDashboard)/vendor/all-items/page.tsx"));
const en = read("src/assets/translations/en.ts");
const pt = read("src/assets/translations/pt.ts");

section("🔴 The endpoint");
{
  check(
    "🔴 the copy posts to /products/copy-to-sub-vendors",
    /serverFetch\.post\(`\/products\/copy-to-sub-vendors`/.test(service),
    "the plural path; `/product/…` is a 404 and so is the per-product route",
  );
  check(
    "🔴 nothing calls the per-product route again",
    !/copy-to-branch/.test(service) &&
      !/copy-to-branch/.test(dialog) &&
      !/copy-to-branch/.test(catalogue),
    "`/products/:productId/copy-to-branch` has never existed — it 404s",
  );
  check(
    "the body is built by the payload builder, not inline",
    /const payload = buildCopyPayload\(input\);/.test(service) &&
      /body: JSON\.stringify\(payload\)/.test(service),
  );
}

section("🔴 The two ids are not interchangeable");
{
  check(
    "🔴 a product is addressed by its PROD- code",
    productCode({ productId: "PROD-1", _id: "6a00000000000000000000aa" }) === "PROD-1" &&
      productCode({ _id: "6a00000000000000000000aa" }) === "",
    "the Mongo _id answers 404 'One or more selected products were not found.'",
  );
  check(
    "a branch is addressed by its _id, falling back to its userId",
    branchTargetId({ _id: "oid", userId: "SV-1" }) === "oid" &&
      branchTargetId({ userId: "SV-1" }) === "SV-1" &&
      branchTargetId(null) === "",
  );
  check(
    "🔴 the catalogue selects PROD- codes, never _ids",
    /selectedIds\.includes\(productCode\(product\)\)/.test(catalogue) &&
      /const code = productCode\(product\);/.test(catalogue),
  );
  check(
    "the product page hands over its PROD- code",
    /productIds=\{\[product\.productId\]\}/.test(details),
  );
}

section("🔴 The payload");
{
  check(
    "selected products, selected branches",
    JSON.stringify(buildCopyPayload({ productIds: ["PROD-1"], targetSubVendorIds: ["a"] })) ===
      JSON.stringify({ copyAllProducts: false, productIds: ["PROD-1"], targetSubVendorIds: ["a"] }),
  );
  check(
    "🔴 copyAllProducts never travels with productIds",
    !("productIds" in buildCopyPayload({
      productIds: ["PROD-1"],
      targetSubVendorIds: ["a"],
      copyAllProducts: true,
    })),
    "400, with an error message describing something else entirely",
  );
  check(
    "🔴 copyToAllTargetSubVendors never travels with targetSubVendorIds",
    !("targetSubVendorIds" in buildCopyPayload({
      productIds: ["PROD-1"],
      targetSubVendorIds: ["a"],
      copyToAllTargetSubVendors: true,
    })),
  );
  check(
    "🔴 no payload can carry sourceVendorId",
    !("sourceVendorId" in buildCopyPayload({
      productIds: ["PROD-1"],
      targetSubVendorIds: ["a"],
      sourceVendorId: "V-1",
    })),
    "403 — admin and super-admin only; a vendor sending one is refused",
  );
  check(
    "no wrapped { payload } form",
    !("payload" in buildCopyPayload({ productIds: ["PROD-1"], targetSubVendorIds: ["a"] })),
    "the schema rejects unknown keys: `Unrecognized key(s) in object: 'payload'`",
  );
  check(
    "duplicates and blanks are dropped",
    JSON.stringify(
      buildCopyPayload({ productIds: ["PROD-1", "PROD-1", ""], targetSubVendorIds: ["a", "a"] }),
    ) === JSON.stringify({ copyAllProducts: false, productIds: ["PROD-1"], targetSubVendorIds: ["a"] }),
  );
  check(
    "🔴 an empty selection never reaches the API",
    copyBlockedReason({ productIds: [], targetSubVendorIds: ["a"] }) === "no_products_selected" &&
      copyBlockedReason({ productIds: ["PROD-1"], targetSubVendorIds: [] }) === "no_branches_selected" &&
      copyBlockedReason({ productIds: ["PROD-1"], targetSubVendorIds: ["a"] }) === null &&
      copyBlockedReason({
        productIds: [],
        targetSubVendorIds: [],
        copyAllProducts: true,
        copyToAllTargetSubVendors: true,
      }) === null,
    "no targets answers 500, not 400",
  );
  check(
    "the dialog refuses to send a blocked selection",
    /if \(copyBlockedReason\(input\)\) return;/.test(dialog),
  );
}

section("🔴 Only approved branches receive anything");
{
  check(
    "🔴 approved, undeleted branches only",
    isCopyTarget({ status: "APPROVED" }) &&
      !isCopyTarget({ status: "PENDING" }) &&
      !isCopyTarget({ status: "REJECTED" }) &&
      !isCopyTarget({ status: "BLOCKED" }) &&
      !isCopyTarget({ status: "APPROVED", isDeleted: true }) &&
      !isCopyTarget(null),
    "an unapproved target is dropped from the copy in silence",
  );
  check(
    "the picker offers only those",
    /const eligible = useMemo\(\(\) => approvedBranches\(branches\), \[branches\]\);/.test(dialog) &&
      /\beligible\.map\(\(branch\)/.test(dialog),
  );
  check(
    "…and the catalogue hides the feature when there are none",
    /const copyTargets = useMemo\(\(\) => approvedBranches\(branches\), \[branches\]\);/.test(catalogue) &&
      /copyTargets\.length > 0/.test(catalogue),
  );
  check(
    "unapproved branches are still shown, with their status",
    /ineligible\.map\(\(branch\)/.test(dialog) && /<BranchStatusBadge status=\{branch\.status\} \/>/.test(dialog),
    "a branch that vanishes from the list looks lost",
  );
  check(
    "approvedBranches keeps only APPROVED",
    approvedBranches([
      { status: "APPROVED", userId: "a" },
      { status: "PENDING", userId: "b" },
      { status: "REJECTED", userId: "c" },
    ])
      .map((b) => b.userId)
      .join() === "a",
  );
}

section("🔴 What the customer is told");
{
  check(
    "🔴 copiedCount 0 is not a success",
    describeCopyResult({ copiedCount: 0, targetCount: 1 }, 1).tone === "info",
    "the API answers 200 with '0 products copied … successfully'",
  );
  check(
    "a short count is reported as partial",
    describeCopyResult({ copiedCount: 1, targetCount: 1 }, 3).tone === "partial",
    "anything already in the branch is skipped, so the count can come back low",
  );
  check(
    "a full count is a success",
    describeCopyResult({ copiedCount: 3, targetCount: 2 }, 3).tone === "success",
  );
  check(
    "a missing result block is not celebrated",
    describeCopyResult(null, 2).tone === "info" && describeCopyResult(undefined, 0).tone === "info",
  );
  check(
    "🔴 the branch is named after the branch, not its owner",
    branchDisplayName(
      { businessDetails: { branchName: "Gulshan" }, name: { firstName: "Masum", lastName: "Billah" } },
      "Branch",
    ) === "Gulshan" &&
      branchDisplayName(
        { businessDetails: { businessName: "Tasca do Bairro" }, name: { firstName: "Masum" } },
        "Branch",
      ) === "Tasca do Bairro" &&
      branchDisplayName({ name: { firstName: "Masum", lastName: "Billah" } }, "Branch") === "Masum Billah",
    "`name` on a vendor is the owner; the picker read 'Masum Billah'",
  );
  check(
    "the selection only clears once something actually moved",
    /if \(summary\.copied > 0\) onCopied\?\.\(\);/.test(dialog),
  );
}

section("The catalogue's selection");
{
  check(
    "selecting is a mode, off by default",
    /const \[selectMode, setSelectMode\] = useState\(false\);/.test(catalogue),
  );
  check(
    "🔴 'all products' sends the flag, not the visible page",
    /copyAllProducts=\{copyAll\}/.test(catalogue) &&
      /productIds=\{copyAll \? \[\] : selectedIds\}/.test(catalogue),
    "the catalogue is paginated; a list would quietly mean 'this page only'",
  );
  check(
    "the dialog forwards that flag into the payload",
    /copyAllProducts,/.test(dialog),
  );
  check(
    "🔴 'all products' ticks every card",
    /selected=\{copyAll \|\| selectedIds\.includes\(productCode\(product\)\)\}/.test(catalogue) &&
      /selectable=\{selectMode\}/.test(catalogue),
    "cards showing no tick under 'the whole catalogue is going' read as nothing selected",
  );
  check(
    "🔴 …and a tap leaves the mode rather than narrowing it to this page",
    /if \(copyAll\) \{\s*setCopyAll\(false\);\s*setSelectedIds\(\[\]\);\s*return;/.test(catalogue),
    "the list is paginated: 'these 19' would silently drop every later page",
  );
  check(
    "the card is unchanged unless selection is on",
    /selectable = false/.test(card) && /selectable \? \(\) => onToggleSelect\?\.\(product\) : undefined/.test(card),
  );
  check(
    "the card's own buttons still work while selecting",
    /onClick=\{\(event\) => event\.stopPropagation\(\)\}/.test(card),
  );
  check(
    "the catalogue page fetches the branches it needs",
    /getAllBranches\(vendorData\.userId\)/.test(itemsPage) && /branches=\{branchResults\?\.data \?\? \[\]\}/.test(itemsPage),
  );
}

section("🔴 Every string is translated");
{
  const keys = new Set();
  for (const source of [dialog, catalogue, card]) {
    for (const [, key] of source.matchAll(/t\("([a-z0-9_]+)"\)/g)) keys.add(key);
  }
  const missing = [...keys].filter(
    (key) =>
      !new RegExp(`^\\s*${key}:`, "m").test(en) || !new RegExp(`^\\s*${key}:`, "m").test(pt),
  );
  check(
    `🔴 all ${keys.size} keys resolve in EN and PT`,
    missing.length === 0,
    `missing: ${missing.join(", ")}`,
  );
  check(
    "no key is defined twice in a dictionary",
    [en, pt].every((dict) => {
      const seen = new Set();
      for (const [, key] of dict.matchAll(/^\s{2}([a-z0-9_]+):/gm)) {
        if (seen.has(key)) return false;
        seen.add(key);
      }
      return true;
    }),
    "a duplicate silently shadows the earlier value",
  );
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
