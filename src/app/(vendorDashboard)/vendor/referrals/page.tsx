export const dynamic = "force-dynamic";

import ReferEarn from "@/src/components/Dashboard/Loyalty/ReferEarn";
import PageLoadError from "@/src/components/PageLoadError/PageLoadError";
import { getMyReferrals } from "@/src/services/dashboard/loyalty/loyalty.service";

// Read fresh on every visit: the counts change when an invited partner
// completes their first order. Branches never get here (proxy.ts).
export default async function ReferralsPage() {
  const result = await getMyReferrals();

  // Zeros and "code not ready" would read as real data.
  if (!result.success) return <PageLoadError busy={result.statusCode === 429} />;

  return <ReferEarn data={result.data ?? null} />;
}
