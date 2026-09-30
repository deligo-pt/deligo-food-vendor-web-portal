/**
 * The offer forms work in both languages, and read in the one on screen.
 *
 *   pnpm verify:offer-language
 *
 * No token, no network: the pure rules run directly (Node strips the types)
 * and the call sites are read off source.
 *
 * ## What this defends (30 Sep 2026)
 *
 * 1. **Dead "Criar Oferta" button.** The form recorded its language once, on
 *    mount; after a switch it checked a field no longer on screen and blocked
 *    the submit with nothing visible.
 * 2. **"title.en é obrigatório".** The submit translated an EMPTY field and
 *    wrote "" over the English the vendor had typed.
 * 3. **Edit Offer wiped on a language switch** — its reset depended on `lang`.
 * 4. **Buy & Reward stuck in English** — its labels were typed in, not `t()`.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const read = (file) => readFileSync(join(root, file), "utf8");
const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const { otherLang, carryOverText, translationSource, keepFilled } = await import(
  join(root, "src/utils/formLanguage.ts")
);
const { countLabel } = await import(join(root, "src/utils/countLabel.ts"));

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

section("🔴 Switching language keeps what was typed");
{
  check("the other language", otherLang("en") === "pt" && otherLang("pt") === "en");
  check(
    "🔴 typed in EN, switched to PT: the PT field shows the text",
    J(carryOverText({ en: "20% off", pt: "" }, "en", "pt")) === J({ en: "20% off", pt: "20% off" }),
    "the PT field used to open empty — the manager's case",
  );
  check(
    "an existing translation is not overwritten",
    J(carryOverText({ en: "20% off", pt: "20% de desconto" }, "en", "pt")) ===
      J({ en: "20% off", pt: "20% de desconto" }),
  );
  check(
    "nothing typed, nothing carried; no switch, no change",
    J(carryOverText({ en: "", pt: "" }, "en", "pt")) === J({ en: "", pt: "" }) &&
      J(carryOverText({ en: "x", pt: "" }, "en", "en")) === J({ en: "x", pt: "" }),
  );
}

section("🔴 The submit translates from the filled side, never over typed text");
{
  check("the language on screen when it has text", translationSource({ en: "", pt: "Oferta" }, "pt") === "pt");
  check(
    "🔴 the other language when the one on screen is empty",
    translationSource({ en: "20% off", pt: "" }, "pt") === "en",
    "translating the empty PT field is what wrote \"\" over title.en",
  );
  check("neither filled → the language on screen", translationSource({ en: "", pt: "" }, "pt") === "pt");
  check(
    "🔴 an empty translation never replaces typed text",
    J(keepFilled({ en: "20% off", pt: "" }, { en: "", pt: "" })) === J({ en: "20% off", pt: "" }),
  );
  check(
    "a real translation is taken",
    J(keepFilled({ en: "", pt: "Oferta" }, { en: "Offer", pt: "Oferta" })) === J({ en: "Offer", pt: "Oferta" }),
  );
}

section("Counts read in the current language");
{
  const t = (k) => ({ one: "1 produto selecionado", many: "{count} produtos selecionados" })[k];
  check(
    "singular and plural, with the number filled in",
    countLabel(t, 1, "one", "many") === "1 produto selecionado" &&
      countLabel(t, 3, "one", "many") === "3 produtos selecionados",
  );
}

const create = stripComments(read("src/components/Dashboard/Offers/CreateOffer/CreateOffer.tsx"));
const edit = stripComments(read("src/components/Dashboard/Offers/ActiveOffers/EditOffer.tsx"));
const picker = stripComments(read("src/components/Dashboard/Offers/CreateOffer/ProductSelection.tsx"));
const hook = stripComments(read("src/hooks/use-form-language.ts"));

section("🔴 Both forms follow the page's language");
{
  check(
    "🔴 the hook keeps currentLang in step and carries text across",
    /form\.setValue\("currentLang" as Path<T>, lang/.test(hook) &&
      /carryOverText\(value, from, lang\)/.test(hook) &&
      /form\.clearErrors\(fields\)/.test(hook) &&
      /\[form, lang, fieldsKey\]/.test(hook),
  );
  for (const [name, code] of [["Create Offer", create], ["Edit Offer", edit]]) {
    check(
      `🔴 ${name}: uses it, translates safely, and never blocks silently`,
      /useFormLanguage\(form, lang, \["title", "description"\]\);/.test(code) &&
        /await translateLocalizedFields\(/.test(code) &&
        !/await translateObject\(/.test(code) &&
        /form\.handleSubmit\(onSubmit, onInvalid\)/.test(code) &&
        /t\("offer_title_description_required"\)/.test(code),
      "translateObject(…, lang) translated from an empty field",
    );
  }
  check(
    "🔴 Edit Offer's reset no longer depends on the language",
    /\}, \[open, offer, reset, getValues\]\);/.test(edit) &&
      !/\}, \[open, offer, lang, reset\]\);/.test(edit),
    "with `lang` in it, switching language wiped every edit",
  );
}

section("🔴 Buy & Reward and the picker are translated");
{
  const english = [
    "Buy & Reward", "Applicable Products", "All Products", "Specific Products",
    "Buy Condition", "Buy Quantity", "Products to buy", "Reward Type",
    "Same Product", "Fixed Product", "Customer Choice", "Reward Quantity",
    "Reward Product", "Reward Options", "Variation SKU", "Select variation SKU",
    "SKU for", "Loading products...", "Creating offer...", "Updating offer...",
  ];
  for (const [name, code] of [["Create Offer", create], ["Edit Offer", edit]]) {
    // Text between tags or in a quoted literal — t("…") keys are snake_case,
    // so they never match these phrases.
    const left = english.filter((s) => {
      const e = s.replace(/[.*+?^${}()|[\]\\&]/g, "\\$&");
      return new RegExp(`(^|>)\\s*${e}\\s*($|<|\\{)|"${e}"`, "m").test(code);
    });
    check(`🔴 ${name}: no hardcoded English left`, left.length === 0, `still English: ${J(left)}`);
    check(
      `${name}: selection counts go through countLabel`,
      /countLabel\(t, [^,]+, "offer_one_product_selected", "offer_n_products_selected"\)/.test(code) &&
        !/\} product\s*\{/.test(code),
    );
  }
  check(
    "the picker's item count and empty state are translated",
    /countLabel\(t, catProducts\.length, "offer_one_item", "offer_n_items"\)/.test(picker) &&
      /t\("no_products_found"\)/.test(picker),
  );
}

section("Every key exists in both languages");
{
  const en = read("src/assets/translations/en.ts");
  const pt = read("src/assets/translations/pt.ts");
  const validation = read("src/validations/offer/offer.validation.ts");
  const used = new Set();
  for (const code of [create, edit, picker]) {
    for (const m of code.matchAll(/t\("([a-z0-9_]+)"\)/g)) used.add(m[1]);
    for (const m of code.matchAll(/"(offer_[a-z0-9_]+)"/g)) used.add(m[1]);
  }
  for (const m of validation.matchAll(/"(offer_err_[a-z0-9_]+)"/g)) used.add(m[1]);
  const missing = [...used].filter(
    (k) => !new RegExp(`^\\s*${k}:`, "m").test(en) || !new RegExp(`^\\s*${k}:`, "m").test(pt),
  );
  check(`all ${used.size} keys present in en and pt`, missing.length === 0, `missing: ${J(missing)}`);
  check(
    "🔴 schema messages are keys, and FormMessage translates them",
    /t\(String\(error\?\.message \?\? ""\)\)/.test(read("components/ui/form.tsx")) &&
      !/"Title is required"|"Description is required"/.test(validation),
    "a Portuguese vendor read English errors",
  );
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
