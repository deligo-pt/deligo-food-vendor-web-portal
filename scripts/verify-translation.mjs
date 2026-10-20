/**
 * A DeepL outage can no longer freeze a form or lose what a vendor typed.
 *
 *   pnpm verify:translation
 *
 * No token, no network: the pure rules run directly (Node strips the types),
 * DeepL's `fetch` is stubbed, and the call sites are read off source.
 *
 * ## What this defends (20 Oct 2026)
 *
 * DeepL answered 456 "Quota exceeded" to every call. `/api/translate` turned
 * it into a bare 500, `translateObject` threw, and every form without its own
 * try/catch left "Adding category..." spinning — nothing was saved.
 *
 * 1. **Forms never hang** — translation never throws.
 * 4. **The vendor decides** — a dialog shows what wasn't translated; they write
 *    the other language, keep the same text, or cancel back to the form.
 * 2. **The real reason surfaces** — 456 is QUOTA_EXCEEDED, not "failed".
 * 3. **The quota is spent only by vendors, and only on what changed** —
 *    the route needs a session; empty, repeated and unchanged texts are skipped.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const read = (file) => readFileSync(join(root, file), "utf8");
const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const { translateWith, translationNotice } = await import(
  join(root, "src/utils/translation/translateWith.ts")
);
const { translateTexts, DeepLError, clearTranslationCache } = await import(join(root, "lib/deepl.ts"));
const { registerTranslationReviewer, reviewTranslations } = await import(
  join(root, "src/utils/translation/translationReview.ts")
);

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

// A `send` that records what it was asked and answers as told.
function sender(answer) {
  const calls = [];
  const send = async (request) => {
    calls.push(request);
    return typeof answer === "function" ? answer(request) : answer;
  };
  return { send, calls };
}
const quota = { ok: false, code: "QUOTA_EXCEEDED" };
const echo = (prefix) => (request) => ({
  ok: true,
  translations: request.texts.map((text) => `${prefix}${text}`),
});

section("🔴 DeepL refuses (the 20 Oct outage): the form still saves");
{
  const category = { name: { en: "", pt: "Bebidas" }, isActive: true, currentLang: "pt" };
  const { send } = sender(quota);
  let outcome;
  let threw = null;
  try {
    outcome = await translateWith(category, "pt", send);
  } catch (error) {
    threw = error;
  }
  check("🔴 translation does not throw — the toast can close", threw === null, threw?.message);
  check("the reason comes back as QUOTA_EXCEEDED", outcome?.error === "QUOTA_EXCEEDED", outcome?.error);
  check(
    "🔴 the empty language gets a copy of what was typed — the API's required check passes",
    J(outcome?.result.name) === J({ en: "Bebidas", pt: "Bebidas" }),
    J(outcome?.result.name),
  );
  check(
    "other fields are untouched",
    outcome?.result.isActive === true && outcome?.result.currentLang === "pt",
  );
  check("the form's own object is not mutated", category.name.en === "");

  const edit = { name: { en: "Drinks", pt: "Bebidas frescas" } };
  const kept = await translateWith(edit, "pt", sender(quota).send);
  check(
    "an existing translation is kept, not replaced by the other language",
    J(kept.result.name) === J({ en: "Drinks", pt: "Bebidas frescas" }),
    J(kept.result.name),
  );

  const crashed = await translateWith(
    { name: { en: "Pizza", pt: "" } },
    "en",
    async () => {
      throw new TypeError("Failed to fetch");
    },
  );
  check(
    "a network error is a fallback too, not a throw",
    crashed.error === "UNAVAILABLE" && crashed.result.name.pt === "Pizza",
    J(crashed),
  );

  const short = await translateWith(
    { a: { en: "One", pt: "" }, b: { en: "Two", pt: "" } },
    "en",
    sender({ ok: true, translations: ["Um"] }).send,
  );
  check(
    "a reply with the wrong number of texts is not trusted",
    short.error === "UNAVAILABLE" && short.result.a.pt === "One" && short.result.b.pt === "Two",
    J(short),
  );
}

section("Translation works: same result as before");
{
  const { send, calls } = sender(echo("PT:"));
  const outcome = await translateWith(
    { name: { en: "Drinks", pt: "" }, options: [{ label: { en: "Large", pt: "" } }] },
    "en",
    send,
  );
  check("no error", outcome.error === null);
  check("one request, EN → PT", calls.length === 1 && calls[0].sourceLang === "EN" && calls[0].targetLang === "PT");
  check(
    "nested and array fields are filled",
    outcome.result.name.pt === "PT:Drinks" && outcome.result.options[0].label.pt === "PT:Large",
    J(outcome.result),
  );

  const edit = await translateWith({ name: { en: "Drinks", pt: "Bebidas frescas" } }, "pt", sender(echo("EN:")).send);
  check(
    "an edit re-translates the language on screen over the old one",
    edit.result.name.en === "EN:Bebidas frescas",
    J(edit.result.name),
  );

  const blank = await translateWith(
    { name: { en: "Drinks", pt: "" } },
    "en",
    sender({ ok: true, translations: [""] }).send,
  );
  check(
    "a blank translation never leaves the field empty",
    blank.result.name.pt === "Drinks",
    J(blank.result.name),
  );
}

section("🔴 Only what needs translating is sent");
{
  const { send, calls } = sender(echo("X:"));
  await translateWith({ name: { en: "", pt: "" }, isActive: true }, "en", send);
  check("🔴 nothing typed → no request at all (empty texts used to be sent)", calls.length === 0, J(calls));

  const mixed = sender(echo("PT:"));
  const outcome = await translateWith({ name: { en: "Burger", pt: "" }, note: { en: "", pt: "" } }, "en", mixed.send);
  check(
    "an empty field is left out of the request",
    mixed.calls.length === 1 && J(mixed.calls[0].texts) === J(["Burger"]),
    J(mixed.calls),
  );
  check("…and stays empty", J(outcome.result.note) === J({ en: "", pt: "" }));

  const switched = sender(echo("PT:"));
  const carried = await translateWith({ title: { en: "20% off", pt: "" } }, "pt", switched.send);
  check(
    "🔴 typed in EN, submitted in PT: translated EN → PT, not \"\" written over the English",
    switched.calls[0]?.sourceLang === "EN" && J(carried.result.title) === J({ en: "20% off", pt: "PT:20% off" }),
    J({ calls: switched.calls, result: carried.result }),
  );
}

section("The vendor is told, in the portal's language");
{
  check(
    "PT notice names the limit",
    translationNotice("QUOTA_EXCEEDED", "pt").startsWith("O limite de tradução automática foi atingido."),
    translationNotice("QUOTA_EXCEEDED", "pt"),
  );
  check(
    "EN notice says the save goes ahead",
    translationNotice("QUOTA_EXCEEDED", "en").includes("Saving without translation"),
  );
  check(
    "an unknown code still reads as a sentence",
    translationNotice("SOMETHING_NEW", "en").startsWith("Automatic translation is unavailable"),
  );
}

section("🔴 What the translation dialog is given");
{
  const outcome = await translateWith(
    { name: { en: "", pt: "Bebidas" }, description: { en: "Cold drinks", pt: "Bebidas frescas" } },
    "pt",
    sender(quota).send,
  );
  check(
    "🔴 every untranslated text is listed for the vendor",
    J(outcome.review.map((item) => item.path)) === J(["name", "description"]),
    J(outcome.review),
  );
  check(
    "each item says what was typed, in which language, and what it needs",
    J(outcome.review[0]) === J({ path: "name", from: "pt", to: "en", text: "Bebidas", current: "" }),
    J(outcome.review[0]),
  );
  check(
    "an edit shows the current translation, so the vendor can update it",
    outcome.review[1].current === "Cold drinks",
    J(outcome.review[1]),
  );

  const fine = await translateWith({ name: { en: "Drinks", pt: "" } }, "en", sender(echo("PT:")).send);
  check("translation worked → nothing to review, no dialog", fine.review.length === 0);

  const nothing = await translateWith({ name: { en: "", pt: "" } }, "en", sender(quota).send);
  check("nothing typed → nothing to review", nothing.review.length === 0 && nothing.error === null);
}

section("🔴 The dialog is reached through one registry");
{
  const request = { items: [], reason: "QUOTA_EXCEEDED", lang: "pt" };
  check("no dialog mounted → undefined (the caller saves the fallback)", reviewTranslations(request) === undefined);

  const unregister = registerTranslationReviewer(async () => ({ name: "Drinks" }));
  const answer = await reviewTranslations(request);
  check("a mounted dialog's answer comes back", J(answer) === J({ name: "Drinks" }), J(answer));

  registerTranslationReviewer(async () => null);
  check("a cancel comes back as null", (await reviewTranslations(request)) === null);

  unregister();
  check(
    "an old dialog unmounting doesn't remove the new one",
    reviewTranslations(request) !== undefined,
  );
}

section("🔴 lib/deepl.ts keeps DeepL's reason and saves characters");
{
  const realFetch = globalThis.fetch;
  const sent = [];
  const stub = (status, body) => {
    globalThis.fetch = async (_url, init) => {
      sent.push(new URLSearchParams(init.body.toString()).getAll("text"));
      return new Response(JSON.stringify(body), { status });
    };
  };
  process.env.DEEPL_API_KEY = "test-key:fx";

  try {
    clearTranslationCache();
    stub(456, { message: "Quota exceeded. You've used all the characters..." });
    let error = null;
    try {
      await translateTexts({ texts: ["Pizza"], sourceLang: "EN", targetLang: "PT" });
    } catch (caught) {
      error = caught;
    }
    check(
      "🔴 456 → DeepLError QUOTA_EXCEEDED with status and DeepL's message",
      error instanceof DeepLError &&
        error.code === "QUOTA_EXCEEDED" &&
        error.status === 456 &&
        error.message.startsWith("Quota exceeded"),
      error && J({ name: error.name, code: error.code, status: error.status, message: error.message }),
    );

    stub(429, {});
    const limited = await translateTexts({ texts: ["Pizza"], sourceLang: "EN", targetLang: "PT" }).catch((e) => e);
    check("429 → RATE_LIMITED", limited?.code === "RATE_LIMITED", limited?.code);

    stub(403, { message: "Wrong key" });
    const denied = await translateTexts({ texts: ["Pizza"], sourceLang: "EN", targetLang: "PT" }).catch((e) => e);
    check("403 → CONFIG (bad key), not a quota message", denied?.code === "CONFIG", denied?.code);

    sent.length = 0;
    stub(200, { translations: [{ text: "Bebidas" }, { text: "Hambúrguer" }] });
    const first = await translateTexts({
      texts: ["Drinks", "", "Burger", "Drinks"],
      sourceLang: "EN",
      targetLang: "PT",
    });
    check(
      "empty and repeated texts are not sent",
      J(sent) === J([["Drinks", "Burger"]]),
      J(sent),
    );
    check(
      "…but every position gets its answer",
      J(first) === J(["Bebidas", "", "Hambúrguer", "Bebidas"]),
      J(first),
    );

    sent.length = 0;
    const second = await translateTexts({ texts: ["Burger"], sourceLang: "EN", targetLang: "PT" });
    check("a text translated before costs nothing the second time", sent.length === 0 && second[0] === "Hambúrguer", J(sent));

    sent.length = 0;
    stub(200, { translations: [{ text: "Hamburger" }] });
    await translateTexts({ texts: ["Burger"], sourceLang: "PT", targetLang: "EN" });
    check("the cache is per direction", sent.length === 1, J(sent));

    delete process.env.DEEPL_API_KEY;
    const unset = await translateTexts({ texts: ["Novo"], sourceLang: "PT", targetLang: "EN" }).catch((e) => e);
    check("a missing DEEPL_API_KEY is CONFIG, before any request", unset?.code === "CONFIG", unset?.code);
  } finally {
    globalThis.fetch = realFetch;
  }
}

section("🔴 /api/translate needs a vendor session and says why it failed");
{
  const route = stripComments(read("src/app/api/translate/route.ts"));
  check(
    "🔴 reads the accessToken cookie and verifies it",
    /cookies\.get\("accessToken"\)/.test(route) && /verifyJWT\(/.test(route),
  );
  check("no session → 401 UNAUTHORIZED", /fail\(401,\s*"UNAUTHORIZED"/.test(route));
  check("per-vendor rate limit → 429", /isRateLimited\(userId\)/.test(route) && /fail\(429/.test(route));
  check(
    "texts and languages are validated, with size limits",
    /MAX_TEXTS/.test(route) && /MAX_TOTAL_LENGTH/.test(route) && /fail\(400,\s*"INVALID_REQUEST"/.test(route),
  );
  check("DeepL's status and reason go to the server log", /console\.error\(`DeepL \$\{error\.status\}/.test(route));
  check("QUOTA_EXCEEDED reaches the browser as a code", /"QUOTA_EXCEEDED"/.test(route));
}

section("🔴 Every form that translates is covered");
{
  const helper = stripComments(read("src/utils/translation/translationObject.ts"));
  check("🔴 translateObject has no throw left", !/\bthrow\b/.test(helper));
  check("translateObject goes through translateWith", /translateWith\(/.test(helper));
  check("the notice is a single toast per save", /id:\s*"translation-unavailable"/.test(helper));
  check("🔴 a failure opens the dialog", /await reviewTranslations\(/.test(helper));
  check("a cancel resolves null", /if \(answer === null\) return null;/.test(helper));
  check(
    "the vendor's text is written over the fallback copy",
    /applyTranslations\(\s*result,\s*review\.map/.test(helper),
  );

  const layout = stripComments(read("src/app/(vendorDashboard)/layout.tsx"));
  check("🔴 the dialog is mounted in the vendor layout", /<TranslationReviewDialog \/>/.test(layout));

  const dialog = stripComments(read("src/components/TranslationReviewDialog/TranslationReviewDialog.tsx"));
  check("the dialog registers itself", /registerTranslationReviewer\(/.test(dialog));
  check("closing the dialog is a cancel", /onOpenChange=\{\(open\) => !open && finish\(null\)\}/.test(dialog));
  check("Save needs every text filled", /if \(missing\.length\)/.test(dialog));
  check("project theme: pink gradient header", /from-\[#DC3173\] to-\[#E95A9E\]/.test(dialog));

  const keys = (file) => new Set([...read(file).matchAll(/^\s*(\w+):/gm)].map((match) => match[1]));
  const en = keys("src/assets/translations/en.ts");
  const pt = keys("src/assets/translations/pt.ts");
  const used = [...new Set([...dialog.matchAll(/t\("(\w+)"\)/g)].map((match) => match[1]))];
  const untranslated = used.filter((key) => !en.has(key) || !pt.has(key));
  check("every dialog text exists in EN and PT", untranslated.length === 0, J(untranslated));

  const forms = [
    "ProductCategories/AddProductCategory",
    "ProductCategories/EditCategoryModal",
    "Menu/CreateMenu",
    "Menu/EditMenu",
    "Menu/Section/AddSection",
    "Menu/Section/EditMenuSection",
    "Products/ProductForm",
    "Products/EditProductForm",
    "Products/VariationManagement/AddVariationForm",
    "Products/VariationManagement/AddVaritionOptionForm",
    "Products/VariationManagement/ProductVariationCard",
    "AddOns/AddOptionsForm",
    "AddOns/CreateOrEditAddOnsGroup",
  ];
  const bypass = forms.filter((form) => {
    const source = stripComments(read(`src/components/Dashboard/${form}.tsx`));
    return /fetch\(\s*["'`]\/api\/translate/.test(source) || !/translateObject\(/.test(source);
  });
  check("all 13 forms call translateObject (none fetch the route themselves)", bypass.length === 0, J(bypass));

  // Each call site must stop on a cancel; one that used `translated.name`
  // without a check would throw and leave its loading toast spinning.
  const callSites = [...forms, "Offers/CreateOffer/CreateOffer", "Offers/ActiveOffers/EditOffer"].flatMap((form) => {
    const source = stripComments(read(`src/components/Dashboard/${form}.tsx`));
    return [...source.matchAll(/const translated = await translate(?:Object|LocalizedFields)\(/g)].map((match) => {
      const after = source.slice(match.index, match.index + 600);
      return { form, handled: /if \(!translated\) \{\s*toast\.dismiss\(toastId\);/.test(after) };
    });
  });
  const unhandled = callSites.filter((site) => !site.handled).map((site) => site.form);
  check(
    `🔴 all ${callSites.length} call sites stop and close their toast on a cancel`,
    callSites.length === 16 && unhandled.length === 0,
    J({ count: callSites.length, unhandled }),
  );
  check(
    "no form still says \"Translation failed\" for a cancel",
    callSites.every(({ form }) => !/Translation failed|offer_translation_failed/.test(stripComments(read(`src/components/Dashboard/${form}.tsx`)))),
  );

  const localized = stripComments(read("src/utils/translation/translateLocalized.ts"));
  check("the offer forms' translateLocalizedFields uses it too", /translateObject\(/.test(localized));
  check(
    "…in one call, so the dialog opens once per save",
    (localized.match(/translateObject\(/g) || []).length === 1 && /if \(!translated\) return null;/.test(localized),
  );

  const edit = stripComments(read("src/components/Dashboard/Products/EditProductForm.tsx"));
  check(
    "🔴 editing a product compares name/description by text, not object reference",
    /const nameChanged = textChanged\(data\.name/.test(edit) &&
      /const descriptionChanged = textChanged\(data\.description/.test(edit),
  );
  check(
    "…and sends only the changed one to translation",
    /\.\.\.\(nameChanged && \{ name: data\.name \}\)/.test(edit) &&
      /\.\.\.\(descriptionChanged && \{ description: data\.description \}\)/.test(edit),
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
