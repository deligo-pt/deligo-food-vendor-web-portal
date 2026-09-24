// `import type` so this module can also be loaded directly by Node — which is
// what `pnpm verify:product-copy` does, with no bundler and no path aliases.
import type { TVendor } from "@/src/types/vendor.type";
import type {
  TCopyProductsInput,
  TCopyProductsPayload,
  TProductCopyResult,
  TProductCopySummary,
} from "@/src/types/product.type";

/**
 * Copying products to branches: what gets sent, and who is allowed to receive it.
 *
 * No React and no network, so every rule here can be checked on its own.
 *
 * ## The endpoint
 *
 * `POST /products/copy-to-sub-vendors`. Note the plural — `vendor-copy-doc.md`
 * documents `/product/…`, which is a 404, and the portal used to call
 * `/products/:productId/copy-to-branch`, which is also a 404 and is why the
 * dialog never worked.
 *
 * ## The two ids, verified against the test API on 24 Sep 2026
 *
 * | field | accepts | rejects |
 * | --- | --- | --- |
 * | `productIds` | the business code `PROD-XXXXXX` **only** | the Mongo `_id` → 404 "products were not found" |
 * | `targetSubVendorIds` | the branch's Mongo `_id` **or** its `SV-…` userId | anything else → 403 |
 *
 * The asymmetry is easy to get backwards, and it fails as a 404 about
 * *products* rather than as a complaint about the id — so `productCode()` is
 * the only way a product id should reach this payload.
 *
 * Validation order matters when reading errors from this endpoint: targets are
 * checked **before** products, so an unusable target hides whatever is wrong
 * with the product list.
 *
 * ## Rules
 *
 * The backend enforces these; the UI keeps them so the customer sees a
 * disabled button rather than a 400, and because two of its refusals are
 * misleading — `copyAllProducts` sent together with `productIds` returns a 400
 * describing a *different* problem, and omitting targets returns a **500**.
 */

/** The `PROD-XXXXXX` code, which is the only product id this endpoint resolves. */
export function productCode(product: {
  productId?: string | null;
  _id?: string | null;
}): string {
  return product?.productId ?? "";
}

/**
 * The id a branch is addressed by. Both the Mongo `_id` and the `SV-…` userId
 * work; `_id` is preferred because the rest of the platform moved to object
 * ids, and `userId` is the fallback for a payload that carries no `_id`.
 */
export function branchTargetId(branch: TVendor | null | undefined): string {
  return branch?._id ?? branch?.userId ?? "";
}

/**
 * The branch's own name, for a list that is about branches.
 *
 * `name` on a vendor document is the **owner** — rendering it labelled the
 * picker with the person who runs the branch ("Masum Billah") rather than the
 * branch itself.
 */
export function branchDisplayName(branch: TVendor | null | undefined, fallback: string): string {
  const business = branch?.businessDetails;
  const owner = [branch?.name?.firstName, branch?.name?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return business?.branchName || business?.businessName || owner || fallback;
}

/**
 * Whether a branch can receive products at all.
 *
 * Only approved sub-vendors are copied to. An unapproved one is **silently
 * ignored** by the backend — it is not an error and it is not in the result —
 * so an unapproved branch must never be offered as a target, or the customer
 * is told a copy happened that did not.
 */
export function isCopyTarget(branch: TVendor | null | undefined): boolean {
  return branch?.status === "APPROVED" && !branch?.isDeleted;
}

/** The branches worth showing in the picker, in the order they arrived. */
export function approvedBranches(branches: TVendor[] | null | undefined): TVendor[] {
  return (branches ?? []).filter(isCopyTarget);
}

/**
 * Why a selection cannot be sent, or `null` when it can.
 *
 * Returned as a key so the caller can translate it; the copy lives with the
 * rest of the dictionary, not here.
 */
export function copyBlockedReason(
  input: TCopyProductsInput,
): "no_products_selected" | "no_branches_selected" | null {
  if (!input.copyAllProducts && input.productIds.length === 0) {
    return "no_products_selected";
  }
  if (!input.copyToAllTargetSubVendors && input.targetSubVendorIds.length === 0) {
    return "no_branches_selected";
  }
  return null;
}

/**
 * The request body.
 *
 * Built so the two exclusive pairs cannot both appear: `copyAllProducts` wins
 * over `productIds`, `copyToAllTargetSubVendors` wins over
 * `targetSubVendorIds`. There is no `sourceVendorId` parameter, because a
 * vendor sending one is refused outright ("Only admin and super-admin can
 * specify sourceVendorId") — the admin flow belongs to the admin portal.
 *
 * The wrapped `{ payload: … }` form the doc mentions is **not** produced: the
 * schema rejects unknown keys, and `payload` is one of them.
 */
export function buildCopyPayload(input: TCopyProductsInput): TCopyProductsPayload {
  const payload: TCopyProductsPayload = input.copyAllProducts
    ? { copyAllProducts: true }
    : { copyAllProducts: false, productIds: [...new Set(input.productIds)].filter(Boolean) };

  if (input.copyToAllTargetSubVendors) {
    payload.copyToAllTargetSubVendors = true;
  } else {
    payload.targetSubVendorIds = [...new Set(input.targetSubVendorIds)].filter(Boolean);
  }

  return payload;
}

/**
 * What to tell the customer, as a translation key plus its numbers.
 *
 * `copiedCount: 0` comes back as an HTTP 200 with the message "0 products
 * copied to 1 target sub-vendor successfully", because every selected product
 * was already in that branch. That is not a failure, and it is not a success
 * worth celebrating either — it gets its own line.
 */
export function describeCopyResult(
  result: TProductCopyResult | null | undefined,
  requestedProductCount: number,
): TProductCopySummary {
  const copied = result?.copiedCount ?? 0;
  const targets = result?.targetCount ?? 0;

  if (copied === 0) {
    return { tone: "info", key: "copy_nothing_new", copied, targets, requestedProductCount };
  }

  if (requestedProductCount > 0 && copied < requestedProductCount) {
    return { tone: "partial", key: "copy_partial", copied, targets, requestedProductCount };
  }

  return { tone: "success", key: "copy_done", copied, targets, requestedProductCount };
}
