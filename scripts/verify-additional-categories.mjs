/**
 * A product shows, and stays, in every category the vendor gave it.
 *
 *   pnpm verify:additional-categories
 *
 * No token, no network: call sites are read off source (comments stripped).
 *
 * ## What this defends (3 Oct 2026)
 *
 * Create sends `category` + `additionalCategories`, and the API stores both:
 * Faluda (`PROD-LE1JUF`) has main DINNER MENU, additional DESSERT and FAST FOOD
 * TESTING, and `GET /products?category=<DESSERT>` returns it. The panel lost
 * them in two places:
 *
 * 1. **All Items grouped by main category only**, so Faluda was missing from
 *    DESSERT and FAST FOOD TESTING.
 * 2. **Edit didn't load them and never sent them.** The picker opened with the
 *    main category alone, and adding or removing one was never saved. The
 *    PATCH schema accepts the field: `additionalCategories: 123` → "must be a
 *    valid array", while an unknown key → "Unrecognized key(s)".
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const code = (file) =>
  readFileSync(join(root, file), "utf8")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

let passed = 0;
let failed = 0;
function check(name, condition) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}`);
  }
}

const list = code("src/components/Dashboard/Products/Products.tsx");
const edit = code("src/components/Dashboard/Products/EditProductForm.tsx");
const create = code("src/components/Dashboard/Products/ProductForm.tsx");

console.log("\n🔴 1. All Items lists a product under each of its categories");
check(
  "🔴 additional categories are grouped too",
  /product\.additionalCategories\?\.forEach\(\(extra\) => \{\s*const group = extra\?\._id \? groups\[extra\._id\] : undefined;\s*if \(group && !group\.products\.includes\(product\)\) group\.products\.push\(product\);/.test(list),
);
check("an unknown additional category is skipped, not made Uncategorized", !/additionalCategories[\s\S]{0,200}uncategorized/.test(list));

console.log("\n🔴 2. Edit loads and saves them");
check(
  "🔴 the form starts with the product's additional ids (main excluded)",
  /const originalAdditionalCategories = \(prevData\?\.additionalCategories \|\| \[\]\)\s*\.map\(\(c\) => c\?\._id\)\s*\.filter\(\(id\): id is string => Boolean\(id\) && id !== prevData\?\.category\?\._id\);/.test(edit) &&
    /additionalCategories: originalAdditionalCategories,/.test(edit),
);
check(
  "🔴 a change is sent as the whole list",
  /if \(hasChanged\(data\.additionalCategories \|\| \[\], originalAdditionalCategories\)\) \{\s*productData\.additionalCategories = \(data\.additionalCategories \|\| \[\]\)\.filter\(Boolean\);/.test(edit),
);

console.log("\nCreate still sends them");
check("create sends additionalCategories", /additionalCategories: data\.additionalCategories/.test(create));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
