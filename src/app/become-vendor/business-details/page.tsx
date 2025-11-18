import { serverRequest } from "@/lib/serverFetch";
import BusinessDetailsForm from "@/src/components/BecomeVendor/BusinessDetails";
import { TResponse } from "@/src/types";
import { TBusinessCategory } from "@/src/types/category.type";
import { TVendor } from "@/src/types/vendor.type";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function BusinessDetailsPage() {
  const accessToken = (await cookies()).get("accessToken")?.value || "";
  const decoded = jwtDecode(accessToken) as { id: string };

  let businessCategories: TBusinessCategory[] = [];
  let vendor = {} as TVendor;

  try {
    const result = (await serverRequest.get(
      "/categories/businessCategory"
    )) as unknown as TResponse<{ data: TBusinessCategory[] }>;

    if (result?.success) {
      businessCategories = result?.data?.data;
    }
  } catch (err) {
    console.error("Server fetchProducts error:", err);
  }

  try {
    const result = (await serverRequest.get(
      `/vendors/${decoded.id}`
    )) as unknown as TResponse<TVendor>;

    if (result?.success) {
      vendor = result?.data;
    }
  } catch (err) {
    console.error("Server fetchProducts error:", err);
  }

  return (
    <BusinessDetailsForm
      businessCategories={businessCategories}
      vendor={vendor}
    />
  );
}
