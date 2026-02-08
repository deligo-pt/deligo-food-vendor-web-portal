import { serverRequest } from "@/lib/serverFetch";
import ProductDetails from "@/src/components/Dashboard/Products/ProductDetails";
import { TResponse } from "@/src/types";
import { TProduct } from "@/src/types/product.type";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let initialData: TProduct = {} as TProduct;

  try {
    const result = (await serverRequest.get(
      `/products/${id}`,
    )) as TResponse<TProduct>;

    if (result?.success) {
      initialData = result.data;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <ProductDetails product={initialData} />;
}
