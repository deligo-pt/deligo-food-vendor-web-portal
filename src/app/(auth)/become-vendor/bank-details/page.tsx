
import BankDetails from "@/src/components/BecomeVendor/BankDetails";
import { getVendorDetails } from "@/src/services/dashboard/profile/profile.service";
import { getDecodedToken } from "@/src/utils/getDecodedToken";
import { redirect } from "next/navigation";

export default async function BankDetailsPage() {
  const decoded = await getDecodedToken();

  if (!decoded) {
    redirect("/login");
  }

  const result = await getVendorDetails(decoded?.userId);

  return <BankDetails vendor={result?.data} />;
}
