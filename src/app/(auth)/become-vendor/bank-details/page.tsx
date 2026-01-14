import { serverRequest } from "@/lib/serverFetch";
import BankDetails from "@/src/components/BecomeVendor/BankDetails";
import { TResponse } from "@/src/types";
import { TVendor } from "@/src/types/vendor.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function BankDetailsPage() {
  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const decoded = jwtDecode(accessToken) as { userId: string };

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

  return <BankDetails vendor={vendor} />;
}
