import { serverRequest } from "@/lib/serverFetch";
import Profile from "@/src/components/Profile/Profile";
import { TVendor } from "@/src/types/vendor.type";

export default async function ProfilePage() {
  let vendorData: TVendor = {} as TVendor;

  try {
    const result = await serverRequest.get("/profile");

    if (result?.success) {
      vendorData = result?.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <Profile vendor={vendorData} />;
}
