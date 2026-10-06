/**
 * Add Item: no tax is chosen for the vendor, and the ⓘ explains the rates.
 *
 *   pnpm verify:vat-info
 *
 * No token, no network: source and dictionaries are read (comments stripped).
 *
 * ## What this defends (6 Oct 2026)
 *
 * - Add Item pre-selected Standard VAT (23%). The vendor now picks the rate.
 * - The empty field's placeholder read "Standard VAT (23%)", so it looked
 *   chosen when it wasn't. It now names no rate.
 * - The ⓘ beside "Tax (%)" (Add Item only, for now) lists 0/6/13/23% in EN
 *   and PT.
 */

import { readFileSync, existsSync } from "node:fs";
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
const pricing = code("src/components/Dashboard/Products/PricingForm.tsx");
const info = code("src/components/Dashboard/Products/VatRatesInfo.tsx");
const schema = code("src/validations/product/product.validation.ts");

console.log("\n🔴 No default tax");
check("🔴 Add Item starts with no tax", /taxId: "",/.test(create) && !/standardVatTaxId|defaultTaxId/.test(create));
check("the pre-select helper is gone", !existsSync(join(root, "src/utils/tax.ts")));
check("🔴 saving without a tax is still refused", /taxId: z\.string\(\)\.nonempty\(/.test(schema));

console.log("\n🔴 One ⓘ per VAT rate, on Add Item only");
check("🔴 Add Item turns it on", /<PricingForm[\s\S]{0,400}showVatInfo\s*\/>/.test(create));
check("Edit Item doesn't", !/showVatInfo/.test(edit));
check("🔴 no ⓘ beside the Tax label any more", !/<VatRatesInfo\b/.test(pricing) && !/selectedRate/.test(pricing));
check(
  "🔴 each option carries its own ⓘ, outside the label the closed field copies",
  /after: \(\s*<VatRateInfoIcon\s+rate=\{tax\.taxRate\}/.test(pricing) &&
    /<SelectPrimitive\.ItemText>\{children\}<\/SelectPrimitive\.ItemText>\s*\{after\}/.test(code("components/ui/select.tsx")),
);
check(
  "🔴 pressing the ⓘ never selects the rate",
  /onPointerDown=\{stop\}/.test(info) && /onPointerUp=\{stop\}/.test(info) && /onClick=\{\(event\) => \{\s*stop\(event\);/.test(info),
);
check("hover for a mouse, tap to toggle", /onPointerEnter=\{\(event\) => event\.pointerType === "mouse" && show\(\)\}/.test(info));
check("screen readers get the same text as the row's description", /"aria-describedby": `vat-info-\$\{tax\._id\}`/.test(pricing) && /<span id=\{describedById\} className="sr-only">/.test(info));
check("all four rates", [0, 6, 13, 23].every((r) => new RegExp(`\\n\\s*${r}: \\{ title: "vat_info_${r}_title"`).test(info)));

check(
  "🔴 Add Item lists the rates highest first: 23, 13, 6, 0",
  /\.sort\(\(a, b\) => Number\(b\.taxRate\) - Number\(a\.taxRate\)\)/.test(create) && /taxesData=\{taxesByRate\}/.test(create),
);

console.log("\n🔴 Both languages");
const keys = [...[0, 6, 13, 23].flatMap((r) => [`vat_info_${r}_title`, `vat_info_${r}_body`])];
for (const lang of ["en", "pt"]) {
  const dict = raw(`src/assets/translations/${lang}.ts`);
  check(`${lang}: every VAT info key`, keys.every((k) => new RegExp(`\\n  ${k}: "`).test(dict)));
  check(`🔴 ${lang}: the placeholder names no rate`, !/\n  select_tax: "[^"]*\d+%/.test(dict));
}
check("EN headings are the text supplied", /vat_info_13_title: "13% VAT — Intermediate Rate"/.test(raw("src/assets/translations/en.ts")));

console.log("\n🔴 Required-field messages (6 Oct 2026)");
{
  const gen = code("src/validations/product/description-generator.validation.ts");
  check(
    "🔴 no category says it must be chosen, not \"at least 2 characters\"",
    /category: z\.string\(\)\.trim\(\)\.min\(1, "product_err_category_required"\)/.test(schema) &&
      /productCategory: z\.string\(\)\.trim\(\)\.min\(1, "product_err_category_required"\)/.test(gen) &&
      !/Category must be at least/.test(schema + gen),
  );
  check("the tax message is translated too", /taxId: z\.string\(\)\.nonempty\("product_err_tax_required"\)/.test(schema));
  const en = raw("src/assets/translations/en.ts");
  const pt = raw("src/assets/translations/pt.ts");
  check(
    "EN and PT texts",
    /product_err_category_required: "Category is a required field"/.test(en) &&
      /product_err_category_required: "A categoria é um campo obrigatório"/.test(pt) &&
      /product_err_tax_required: "/.test(en) && /product_err_tax_required: "/.test(pt),
  );
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
