/**
 * Sheet row 77 (plan.md §10.2): the product's "2×1" switch reads and writes a
 * buy-one-get-one-free offer.
 *
 *   pnpm verify:two-for-one
 */
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { twoForOneState, twoForOneOfferPayload, TWO_FOR_ONE_USER_LIMIT } = await import(join(root, "src/utils/twoForOne.ts"));

let passed = 0, failed = 0;
const check = (name, ok, detail) => {
  if (ok) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name}${detail === undefined ? "" : `  → ${detail}`}`); }
};
const J = JSON.stringify;
const now = new Date("2026-11-22T12:00:00Z");
const offer = (over = {}) => ({
  _id: "o1", title: { en: "2×1 — Tea", pt: "2×1 — Chá" }, offerType: "BUY_AND_REWARD",
  isActive: true, isDeleted: false, expiresAt: "2027-11-22", createdByRole: "VENDOR",
  buyAndReward: { buy: { scope: "SPECIFIC_PRODUCTS", productIds: ["p1"], quantity: 1 }, reward: { type: "SAME_PRODUCT", quantity: 1 } },
  ...over,
});

console.log("\nReading the state");
check("no offers → off", twoForOneState([], "p1", now).state === "off");
check("own 1+1 same product → on, with its id", J(twoForOneState([offer()], "p1", now)) === J({ state: "on", offerId: "o1", isActive: true }));
check("other product's 2×1 → off", twoForOneState([offer()], "p2", now).state === "off");
check("inactive → off", twoForOneState([offer({ isActive: false })], "p1", now).state === "off");
check("expired → off", twoForOneState([offer({ expiresAt: "2026-11-01" })], "p1", now).state === "off");
check("deleted → off", twoForOneState([offer({ isDeleted: true })], "p1", now).state === "off");
check("percent offer → off", twoForOneState([offer({ offerType: "PERCENT" })], "p1", now).state === "off");
const shared = twoForOneState([offer({ buyAndReward: { buy: { scope: "SPECIFIC_PRODUCTS", productIds: ["p1", "p9"], quantity: 1 }, reward: { type: "SAME_PRODUCT", quantity: 1 } } })], "p1", now);
check("offer shared with other products → locked SHARED, named", shared.state === "locked" && shared.reason === "SHARED" && shared.title === "2×1 — Tea", J(shared));
const buy2 = twoForOneState([offer({ buyAndReward: { buy: { scope: "SPECIFIC_PRODUCTS", productIds: ["p1"], quantity: 2 }, reward: { type: "SAME_PRODUCT", quantity: 1 } } })], "p1", now);
check("buy 2 get 1 → locked (not the switch's)", buy2.state === "locked" && buy2.reason === "SHARED");
const admin = twoForOneState([offer({ createdByRole: "SUPER_ADMIN" })], "p1", now);
check("admin-made 2×1 → locked ADMIN", admin.state === "locked" && admin.reason === "ADMIN");
check("own offer wins over a shared one", twoForOneState([offer({ _id: "o9", buyAndReward: { buy: { scope: "SPECIFIC_PRODUCTS", productIds: ["p1", "p9"], quantity: 1 }, reward: { type: "SAME_PRODUCT", quantity: 1 } } }), offer()], "p1", now).state === "on");
check("populated product ids are read", twoForOneState([offer({ buyAndReward: { buy: { scope: "SPECIFIC_PRODUCTS", productIds: [{ _id: "p1" }], quantity: 1 }, reward: { type: "SAME_PRODUCT", quantity: 1 } } })], "p1", now).state === "on");

console.log("\nThe offer it creates");
const p = twoForOneOfferPayload("p1", { en: "Tea", pt: "Chá" }, now);
check("buy 1 of this product, same product free", J(p.buyAndReward) === J({ buy: { scope: "SPECIFIC_PRODUCTS", productIds: ["p1"], quantity: 1 }, reward: { type: "SAME_PRODUCT", quantity: 1 } }));
check("auto-applied, active, BUY_AND_REWARD", p.isAutoApply && p.isActive && p.offerType === "BUY_AND_REWARD");
check("runs one year from today", p.validFrom === "2026-11-22" && p.expiresAt === "2027-11-22", `${p.validFrom} → ${p.expiresAt}`);
check("usable on every order (not once per customer)", p.userUsageLimit === TWO_FOR_ONE_USER_LIMIT && TWO_FOR_ONE_USER_LIMIT > 1);
check("titles in both languages", p.title.en === "2×1 — Tea" && p.title.pt === "2×1 — Chá");
check("missing PT name falls back to EN", twoForOneOfferPayload("p1", { en: "Tea", pt: "" }, now).title.pt === "2×1 — Tea");
check("what it creates reads back as on", twoForOneState([{ ...p, _id: "new", createdByRole: "VENDOR" }], "p1", now).state === "on");

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
