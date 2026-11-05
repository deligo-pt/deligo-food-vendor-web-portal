export const dynamic = "force-dynamic";

import Rewards from "@/src/components/Dashboard/Loyalty/Rewards";
import PageLoadError from "@/src/components/PageLoadError/PageLoadError";
import { getMyPoints, getRewards } from "@/src/services/dashboard/loyalty/loyalty.service";
import { normalizePoints } from "@/src/utils/loyalty";

// Read fresh on every visit (guide §5): the admin can hide a reward at any
// time, and the balance drops at claim time and when old points expire.
// A claim calls `router.refresh()`, which re-runs this.
export default async function RewardsPage() {
  const [rewards, points] = await Promise.all([getRewards(), getMyPoints()]);

  const failed = [rewards, points].find((r) => !r.success);
  if (failed) return <PageLoadError busy={failed.statusCode === 429} />;

  return (
    <Rewards
      rewards={Array.isArray(rewards.data) ? rewards.data : []}
      currentPoints={normalizePoints(points.data).currentPoints}
    />
  );
}
