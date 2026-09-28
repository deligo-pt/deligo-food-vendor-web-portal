/**
 * Which store the header says you are in.
 *
 *   pnpm verify:vendor-name
 *
 * No token, no network: the helper runs directly (Node strips the types) and
 * the call site is read off source.
 *
 * ## What this defends
 *
 * A vendor and its branches share one portal. Every screen looks identical
 * whichever account is signed in, so the name in the topbar is the only thing
 * that says *where you are* — and a vendor who edits the wrong branch's
 * catalogue does not find out from the UI. Each rule here guards a way of
 * showing a name that is true of some other account:
 *
 * 1. **A branch labelled with its parent's business name.** "Tasca do Bairro"
 *    on every one of six branches, which is the state before this existed.
 * 2. **A parent labelled with a branch name**, if the fallback runs the wrong
 *    way round for a record that carries both.
 * 3. **An empty pill**, for a branch whose `branchName` was never set — of
 *    which there are several on the test account.
 * 4. **`role` ignored**, leaving the id shape to decide, which is right only
 *    while every payload happens to carry the prefix.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const read = (file) => readFileSync(join(root, file), "utf8");

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

const { vendorDisplayName } = await import(join(root, "src/utils/vendorName.ts"));
const { isMainBranch } = await import(join(root, "src/utils/productCopy.ts"));
const topbar = read("src/components/vendorTopbar/Topbar.tsx");

const account = (extra, businessName, branchName) => ({
  ...extra,
  businessDetails: { businessName, branchName },
});

section("🔴 A branch is called by its own name");
{
  check(
    "🔴 the branch's name, not its parent's",
    vendorDisplayName(
      account({ role: "SUB_VENDOR", userId: "SV-BJQPVEMB" }, "Tasca do Bairro", "Bashundhara"),
    ) === "Bashundhara",
    "six branches all reading 'Tasca do Bairro' is the state this replaced",
  );
  check(
    "🔴 and the parent's is its business name, even when a branchName is set",
    vendorDisplayName(
      account({ role: "VENDOR", userId: "V-IN0AMES9" }, "Tasca do Bairro", "Gulshan"),
    ) === "Tasca do Bairro",
    "the fallback running the wrong way round labels the parent as a branch",
  );
}

section("🔴 Decided by role first, id shape second");
{
  check(
    "🔴 `role` wins over the id it disagrees with",
    isMainBranch({ role: "SUB_VENDOR", userId: "V-WEIRD" }) === false &&
      isMainBranch({ role: "VENDOR", userId: "SV-WEIRD" }) === true,
  );
  check(
    "the id shape decides when the payload carries no role",
    vendorDisplayName(account({ userId: "SV-A0V2NRD9" }, "Tasca do Bairro", "Gulshan")) ===
      "Gulshan" &&
      vendorDisplayName(account({ userId: "V-IN0AMES9" }, "Tasca do Bairro", "Gulshan")) ===
        "Tasca do Bairro",
    "/profile 403s for a branch and the fallback payload may not carry `role`",
  );
}

section("🔴 The pill is never blank");
{
  check(
    "🔴 a branch with no branchName falls back to the business name",
    vendorDisplayName(account({ role: "SUB_VENDOR", userId: "SV-X" }, "Tasca do Bairro", "  ")) ===
      "Tasca do Bairro",
    "branches with no branchName exist on the test account today",
  );
  check(
    "a parent with no businessName falls back the other way",
    vendorDisplayName(account({ role: "VENDOR", userId: "V-X" }, "", "Matriz")) === "Matriz",
  );
  check(
    "no vendor at all is an empty string, not undefined",
    vendorDisplayName(undefined) === "" && vendorDisplayName(null) === "",
    "`undefined` would render the word in the pill",
  );
}

section("The header actually asks");
{
  check(
    "🔴 the topbar reads the helper, not businessName directly",
    /vendorDisplayName\(vendor\)/.test(topbar) &&
      !/vendor\?\.businessDetails\?\.businessName/.test(topbar),
    "reading the field directly is exactly the bug this replaced",
  );
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
