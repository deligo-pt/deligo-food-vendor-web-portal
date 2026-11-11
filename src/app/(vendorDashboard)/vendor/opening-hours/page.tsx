import OpeningHoursForm from "@/src/components/Schedule/OpeningHoursForm";
import { getVendorDetails } from "@/src/services/dashboard/profile/profile.service";
import type { TVendor } from "@/src/types/vendor.type";
import { getDecodedToken } from "@/src/utils/getDecodedToken";

// Always the stored week: an editor opened on a cached copy could save over a
// newer schedule.
export const dynamic = "force-dynamic";

/** Settings → Opening Hours: the signed-in store's own weekly schedule. */
export default async function OpeningHoursPage() {
  const decoded = await getDecodedToken();
  const result = await getVendorDetails(decoded?.userId as string);
  const store = result?.data as TVendor | undefined;

  if (!result?.success || !store?.userId) {
    throw new Error(result?.message || "Could not load the store");
  }

  return <OpeningHoursForm store={store} />;
}
