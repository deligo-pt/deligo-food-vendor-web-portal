import { serverRequest } from "@/lib/serverFetch";
import RegistrationStatus from "@/src/components/BecomeVendor/RegistrationStatus";
import { USER_STATUS } from "@/src/consts/user.const";
import { TResponse } from "@/src/types";
import { TVendor } from "@/src/types/vendor.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function RegistrationStatusPage() {
  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const decoded = jwtDecode(accessToken) as {
    userId: string;
    status: keyof typeof USER_STATUS;
  };

  let vendor = {} as TVendor;

  try {
    const result = (await serverRequest.get(
      `/vendors/${decoded.userId}`
    )) as unknown as TResponse<TVendor>;

    if (result?.success) {
      vendor = result?.data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log("Server fetch error:", err?.response?.data);
  }

  return <RegistrationStatus vendor={vendor} decodedStatus={decoded.status} />;
}
