export const dynamic = "force-dynamic";

import MyPoints from "@/src/components/Dashboard/Loyalty/MyPoints";
import PageLoadError from "@/src/components/PageLoadError/PageLoadError";
import { USER_ROLE } from "@/src/consts/user.const";
import {
  getMyPoints,
  getMyPointsHistory,
  getMyReferrals,
} from "@/src/services/dashboard/loyalty/loyalty.service";
import { getDecodedToken } from "@/src/utils/getDecodedToken";
import { normalizePoints, normalizeReferralSummary } from "@/src/utils/loyalty";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

// Read fresh on every visit: the balance drops at claim time and when the
// nightly job expires old points (guide §3.1).
export default async function PointsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const page = Math.max(1, Number(queries.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(queries.limit) || 10));

  // A branch can't call my-referrals (403); it only feeds the "how to earn"
  // referral line, so a failure there never blocks the page.
  const isBranch = (await getDecodedToken())?.role === USER_ROLE.SUB_VENDOR;

  const [points, history, referrals] = await Promise.all([
    getMyPoints(),
    getMyPointsHistory({ page, limit }),
    isBranch ? Promise.resolve(null) : getMyReferrals(),
  ]);

  const failed = [points, history].find((r) => !r.success);
  if (failed) return <PageLoadError busy={failed.statusCode === 429} />;

  const perReferral = referrals?.success ? normalizeReferralSummary(referrals.data).pointsPerReferral : 0;

  return (
    <MyPoints
      balance={normalizePoints(points.data)}
      history={Array.isArray(history.data) ? history.data : []}
      meta={history.meta}
      pointsPerReferral={perReferral > 0 ? perReferral : null}
    />
  );
}
