/**
 * Product photos are checked before upload: JPG/PNG/WEBP, at most 5 MB,
 * square and at least 1200 × 1200 px. All three block (6 Oct 2026).
 *
 *   pnpm verify:product-image
 *
 * No network: `utils/productImageRules.ts` runs directly (Node strips the
 * types), and the uploader's wiring is read off source.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = (f) => readFileSync(join(root, f), "utf8");
const code = (f) =>
  raw(f).replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const R = await import(join(root, "src/utils/productImageRules.ts"));

let passed = 0;
let failed = 0;
const check = (name, ok, detail) => {
  if (ok) passed++;
  else failed++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${!ok && detail ? `  → ${detail}` : ""}`);
};
const MB = 1024 * 1024;
const key = (p) => p?.key ?? null;
const J = JSON.stringify;

console.log("\n🔴 Format and file size");
check("JPG, PNG, WEBP pass", ["image/jpeg", "image/png", "image/webp"].every((type) => R.checkImageFile({ type, size: MB }) === null));
for (const type of ["image/svg+xml", "image/gif", "image/heic", "application/pdf"]) {
  check(`🔴 ${type} is refused`, key(R.checkImageFile({ type, size: MB })) === "img_err_type");
}
check("an empty type falls back to the extension", R.checkImageFile({ type: "", size: MB, name: "dish.WEBP" }) === null && key(R.checkImageFile({ type: "", size: MB, name: "dish.heic" })) === "img_err_type");
check("exactly 5 MB passes", R.checkImageFile({ type: "image/png", size: 5 * MB }) === null);
check(
  "🔴 over 5 MB is refused, with the actual size",
  J(R.checkImageFile({ type: "image/jpeg", size: 7.4 * MB })) === J({ key: "img_err_too_large", vars: { size: "7.4" } }),
);

console.log("\n🔴 Pixels: square, at least 1200");
check("🔴 1200 × 1200 passes", R.checkImageDimensions(1200, 1200) === null);
check("🔴 1500 × 1500 passes (larger is fine)", R.checkImageDimensions(1500, 1500) === null);
check("🔴 1600 × 1200 is refused: not square", J(R.checkImageDimensions(1600, 1200)) === J({ key: "img_err_not_square", vars: { w: "1600", h: "1200" } }));
check("🔴 800 × 800 is refused: too small", J(R.checkImageDimensions(800, 800)) === J({ key: "img_err_too_small", vars: { w: "800", h: "800" } }));
check("1199 × 1199 is refused", key(R.checkImageDimensions(1199, 1199)) === "img_err_too_small");
check("an unreadable size is refused", key(R.checkImageDimensions(0, 0)) === "img_err_unreadable");

console.log("\n🔴 The uploader enforces it, on both paths");
const up = code("src/components/Dashboard/Products/ProductImageUpload.tsx");
check(
  "🔴 first upload and Replace both check before uploading",
  (up.match(/const problem = await checkBeforeUpload\(file\);\s*if \(problem\) \{\s*setError\(problem\);/g) ?? []).length === 2,
);
check("format and size, then the pixels", /checkImageFile\(file\)[\s\S]*readImageSize\(file\)[\s\S]*checkImageDimensions\(size\.width, size\.height\)/.test(up));
check("both pickers offer only JPG/PNG/WEBP", (up.match(/accept=\{PRODUCT_IMAGE_ACCEPT\}/g) ?? []).length === 2 && !/accept="image\/\*"/.test(up));
check("the box states the rules", /t\("img_spec_size_value"\)/.test(up) && /5 MB/.test(up) && /JPG \/ PNG \/ WEBP/.test(up));
check("nothing is resized or compressed", !/canvas|toBlob|compress/i.test(up));

console.log("\n🔴 Both languages");
const keys = ["img_spec_size", "img_spec_size_value", "img_spec_max", "img_spec_format", "img_err_type", "img_err_too_large", "img_err_not_square", "img_err_too_small", "img_err_unreadable"];
for (const lang of ["en", "pt"]) {
  const dict = raw(`src/assets/translations/${lang}.ts`);
  check(`${lang}: every message`, keys.every((k) => new RegExp(`\\n  ${k}: "`).test(dict)));
  check(`${lang}: the old "PNG, JPG, SVG" hint is gone`, !/png_jpg_svg/.test(dict));
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
