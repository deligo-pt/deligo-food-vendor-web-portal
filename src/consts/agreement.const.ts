/**
 * Sent on `window` once an agreement is signed. The topbar's "Please visit
 * your Profile for re-sign your agreement" notice listens for it and checks
 * the agreement again: the topbar lives in the layout, so neither the page
 * change nor `router.refresh()` that follows a signature reloads it.
 */
export const AGREEMENT_SIGNED_EVENT = "deligo:agreement-signed";
