import { serverRequest } from "@/lib/serverFetch";
import { TVendor } from "@/src/types/vendor.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { verifyJWT } from "@/src/utils/verifyJWT";
import { cookies } from "next/headers";

export const getVendorInfo = async (): Promise<{
  vendor: TVendor;
  accessToken: string;
} | null> => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value || "";

  if (accessToken) {
    const decoded = await verifyJWT(accessToken);

    if (decoded.success && decoded?.data?.role === "VENDOR") {
      const result = await catchAsync<TVendor>(async () => {
        return await serverRequest.get(`/vendors/${decoded?.data?.userId}`);
      });

      if (result?.success) {
        return { vendor: result?.data, accessToken };
      }
      return null;
    }
    return null;
  }

  return null;
};
