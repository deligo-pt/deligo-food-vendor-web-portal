/**
 * Offer product pickers show only products a customer can buy.
 *
 *   pnpm verify:offer-products
 *
 * No token, no network: the helper runs directly (Node strips the types) and
 * the call sites are read off source.
 *
 * ## What this defends
 *
 * Create Offer listed every product, inactive ones included — "Chicken Soup"
 * (`meta.status: "INACTIVE"`) on Tasca do Bairro, measured 30 Sep 2026. An
 * offer on an inactive product discounts nothing a customer can buy. Each rule
 * guards one way back to that, or one way of over-correcting:
 *
 * 1. **Create Offer asks for everything again**, if the page's query loses
 *    `meta.status=ACTIVE`.
 * 2. **Edit Offer lists inactive products** it has no reason to.
 * 3. **Edit Offer hides a product the offer already holds** because it was
 *    switched off later — then it can be neither seen nor unticked.
 * 4. **The picker stops saying which one is inactive.**
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const read = (file) => readFileSync(join(root, file), "utf8");

const { ACTIVE_PRODUCTS_QUERY, isActiveProduct, offerProductIds, offerPickerProducts } =
  await import(join(root, "src/utils/offerProducts.ts"));

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
const J = JSON.stringify;

// Shaped like `GET /products` on Tasca do Bairro, 30 Sep 2026.
const ICE_CREAM = { _id: "a1", name: { en: "Ice Cream" }, isDeleted: false, meta: { status: "ACTIVE" } };
const CHICKEN_SOUP = { _id: "a2", name: { en: "Chicken Soup" }, isDeleted: false, meta: { status: "INACTIVE" } };
const PETIS = { _id: "a3", name: { en: "Petis" }, isDeleted: false, meta: { status: "ACTIVE" } };
const DELETED = { _id: "a4", name: { en: "Gone" }, isDeleted: true, meta: { status: "ACTIVE" } };
const CATALOGUE = [ICE_CREAM, CHICKEN_SOUP, PETIS, DELETED];
const names = (list) => list.map((p) => p.name.en);

section("What counts as active");
{
  check("meta.status ACTIVE is active", isActiveProduct(ICE_CREAM) === true);
  check("🔴 meta.status INACTIVE is not", isActiveProduct(CHICKEN_SOUP) === false);
  check("a deleted product is not, whatever its status", isActiveProduct(DELETED) === false);
  check(
    "a product with no status is not — no guessing",
    isActiveProduct({ _id: "x", isDeleted: false }) === false && isActiveProduct(null) === false,
  );
  check(
    "the API query is the one the price pages already send",
    J(ACTIVE_PRODUCTS_QUERY) === J({ "meta.status": "ACTIVE" }),
    "measured: GET /products?meta.status=ACTIVE → 12 of 13, Chicken Soup left out",
  );
}

section("🔴 What a picker lists");
{
  check(
    "🔴 creating: active products only",
    J(names(offerPickerProducts(CATALOGUE))) === J(["Ice Cream", "Petis"]),
  );
  check(
    "🔴 editing: an inactive product the offer holds stays listed",
    J(names(offerPickerProducts(CATALOGUE, ["a2"]))) === J(["Ice Cream", "Chicken Soup", "Petis"]),
    "hidden, it could be neither seen nor unticked, and would ride along invisibly on save",
  );
  check(
    "…but no other inactive product comes with it",
    J(names(offerPickerProducts([...CATALOGUE, { ...CHICKEN_SOUP, _id: "a5", name: { en: "Other" } }], ["a2"]))) ===
      J(["Ice Cream", "Chicken Soup", "Petis"]),
  );
  check(
    "the API's order is kept, and nothing is mutated",
    offerPickerProducts(CATALOGUE) !== CATALOGUE && CATALOGUE.length === 4,
  );
  check("no products is an empty list, not a crash", J(offerPickerProducts(null)) === "[]");
}

section("🔴 Every product an offer refers to is found");
{
  const offer = {
    scopeProducts: ["s1", "s2"],
    buyAndReward: {
      buy: { productIds: ["b1", "s1"] },
      reward: { productId: "r1", options: [{ productId: "o1" }, { productId: "" }] },
    },
  };
  check(
    "🔴 scope, buy, reward and reward options — deduplicated",
    J(offerProductIds(offer)) === J(["s1", "s2", "b1", "r1", "o1"]),
    "offers store plain id strings (measured on 10 live offers)",
  );
  check(
    "the older applicableProducts field is read too",
    J(offerProductIds({ applicableProducts: ["p1"] })) === J(["p1"]),
  );
  check(
    "an offer with none, or none at all, gives none",
    J(offerProductIds({})) === "[]" && J(offerProductIds(null)) === "[]",
  );
}

section("🔴 The forms use it");
{
  const createPage = read("src/app/(vendorDashboard)/vendor/create-offer/page.tsx");
  check(
    "🔴 Create Offer asks the API for active products",
    /\.\.\.ACTIVE_PRODUCTS_QUERY,/.test(createPage) &&
      /params: \{ \.\.\.query, limit: total \}/.test(createPage),
    "both the first request and the full-catalogue one must carry it",
  );

  const create = read("src/components/Dashboard/Offers/CreateOffer/CreateOffer.tsx");
  check(
    "Create Offer filters again on the client",
    /offerPickerProducts\(itemsResult\.data\)/.test(create),
  );

  const edit = read("src/components/Dashboard/Offers/ActiveOffers/EditOffer.tsx");
  check(
    "🔴 Edit Offer keeps the offer's own products and drops the other inactive ones",
    /offerProductIds\(offer\)/.test(edit) &&
      /offerPickerProducts\(\s*result\.data,/.test(edit) &&
      !/setProducts\(result\.data/.test(edit),
    "setProducts(result.data) is the old line: every product, inactive included",
  );

  const picker = read("src/components/Dashboard/Offers/CreateOffer/ProductSelection.tsx");
  check(
    "🔴 the picker labels an inactive product",
    /!isActiveProduct\(product\) &&/.test(picker) && /t\("inactive_product"\)/.test(picker),
  );

  const en = read("src/assets/translations/en.ts");
  const pt = read("src/assets/translations/pt.ts");
  check(
    "the label exists in both languages",
    /inactive_product: "Inactive"/.test(en) && /inactive_product: "Inativo"/.test(pt),
  );
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
