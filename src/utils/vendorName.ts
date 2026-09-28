// `import type` so this module can also be loaded directly by Node — which is
// what the verify scripts do, with no bundler and no path aliases.
import type { TVendor } from "@/src/types/vendor.type";

import { isMainBranch } from "./productCopy.ts";

/**
 * What this account is called, for a header that says where you are.
 *
 * `isMainBranch` answers the "which am I" half and is imported rather than
 * repeated. It lives in `productCopy.ts` for a reason that has nothing to do
 * with copying: that module is loaded directly by `verify:product-copy` under
 * bare Node, which cannot resolve `@/` aliases, so its exports cannot import
 * across one. See the note there.
 */

/**
 * The name this account is known by, for a header that says where you are.
 *
 * A branch is its **branch name** — "Bashundhara", not "Tasca do Bairro" — and
 * the parent is its business name. A vendor signed into a branch needs the
 * header to tell the two apart, since everything else on the screen looks the
 * same.
 *
 * Both fall back to the other. Branches exist today with no `branchName` set
 * at all (they show as plain "Tasca do Bairro" in the copy-to-branch picker),
 * and a header that renders an empty pill for them would be worse than one
 * that repeats the business name.
 */
export function vendorDisplayName(vendor: TVendor | null | undefined): string {
  const business = vendor?.businessDetails;
  const branchName = business?.branchName?.trim() ?? "";
  const businessName = business?.businessName?.trim() ?? "";

  return isMainBranch(vendor)
    ? businessName || branchName
    : branchName || businessName;
}
