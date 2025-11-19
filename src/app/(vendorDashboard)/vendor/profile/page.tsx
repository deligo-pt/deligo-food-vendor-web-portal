import { serverRequest } from "@/lib/serverFetch";
import Profile from "@/src/components/Profile/Profile";
import { TVendor } from "@/src/types/vendor.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const decoded = jwtDecode(accessToken) as { id: string };

  let vendorData: TVendor = {} as TVendor;

  try {
    const result = await serverRequest.get(`/vendors/${decoded.id}`);

    if (result?.success) {
      vendorData = result?.data;
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return <Profile vendor={vendorData} />;
}
