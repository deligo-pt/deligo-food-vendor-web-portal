import { NextResponse } from "next/server";
import { getEveryProductCode } from "@/src/services/dashboard/products/products";

/**
 * Every product code of the signed-in vendor, for the All Items page's "All
 * products" selection (13 Oct 2026).
 *
 * A route rather than a server action on purpose: Next runs a page's server
 * actions one at a time, and All Items is loading its categories through them
 * in the background. As an action this read waited behind those — 5–9 s to
 * untick one card, measured. A plain request is not in that queue.
 *
 * The vendor is whoever the session cookie says; there is nothing to pass in.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getEveryProductCode().catch(() => ({ success: false, codes: [] as string[] }));
  return NextResponse.json(result, { status: result.success ? 200 : 502, headers: { "Cache-Control": "no-store" } });
}
