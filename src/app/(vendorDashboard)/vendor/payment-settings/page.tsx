import { serverRequest } from "@/lib/serverFetch";
import PaymentSettings from "@/src/components/Dashboard/Payments/PaymentSettings/PaymentSettings";
import { TVendor } from "@/src/types/vendor.type";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function PaymentSettingsPage() {
  let vendorData: TVendor["bankDetails"] = {} as TVendor["bankDetails"];

  try {
    const result = await serverRequest.get("/profile");

    if (result?.success) {
      vendorData = result?.data?.bankDetails;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
    if (isRedirectError(err)) throw err;
  }
  return <PaymentSettings bankDetails={vendorData} />;
}
