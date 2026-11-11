import OpeningHoursForm from "@/src/components/Schedule/OpeningHoursForm";
import { USER_ROLE } from "@/src/consts/user.const";
import { getVendorDetails } from "@/src/services/dashboard/profile/profile.service";
import type { TVendor } from "@/src/types/vendor.type";
import { getDecodedToken } from "@/src/utils/getDecodedToken";
import { notFound } from "next/navigation";

// Always the stored week (see /vendor/opening-hours).
export const dynamic = "force-dynamic";

interface IProps {
  params: Promise<{ id: string }>;
}

/** The parent vendor's id, whether the API sent it populated or as a plain id. */
function parentUserId(branch: TVendor): string | undefined {
  const parent = branch.parentVendorId as unknown;
  if (typeof parent === "string") return parent;
  return (parent as { userId?: string } | null)?.userId;
}

/**
 * A parent vendor edits one of its branches' weekly schedule
 * (FRONTEND_VENDOR_SCHEDULE_GUIDE §9: a branch starts with a copy of the
 * parent's schedule; later changes to the parent never reach it, so each
 * branch is edited here, `PATCH /vendors/:branchUserId`).
 *
 * Only the branch's own parent gets the page. The backend checks the same, but
 * a branch account or another vendor would otherwise see an editor that can
 * only fail.
 */
export default async function BranchHoursPage({ params }: IProps) {
  const { id } = await params;
  const decoded = await getDecodedToken();
  if (decoded?.role !== USER_ROLE.VENDOR) notFound();

  const result = await getVendorDetails(id);
  const branch = result?.data as TVendor | undefined;
  if (!result?.success || !branch?.userId) notFound();
  if (branch.role !== USER_ROLE.SUB_VENDOR || parentUserId(branch) !== decoded.userId) notFound();

  return (
    <OpeningHoursForm
      store={branch}
      subtitle={branch.businessDetails?.branchName || branch.businessDetails?.businessName}
      backHref={`/vendor/branches/${branch.userId}`}
    />
  );
}
