import { serverRequest } from "@/lib/serverFetch";
import RegistrationStatus from "@/src/components/BecomeVendor/RegistrationStatus";
import { TResponse } from "@/src/types";
import { TVendor } from "@/src/types/vendor.type";
import { getDecodedToken } from "@/src/utils/getDecodedToken";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export default async function RegistrationStatusPage() {
  const decoded = await getDecodedToken();

  if (!decoded) {
    redirect("/login");
  }

  let vendor = {} as TVendor;

  try {
    const result = (await serverRequest.get(
      `/vendors/${decoded.userId}`,
    )) as unknown as TResponse<TVendor>;

    if (result?.success) {
      vendor = result?.data;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log("Server fetch error:", err?.response?.data);
    if (isRedirectError(err)) throw err;
  }

  return <RegistrationStatus vendor={vendor} />;
}
