import { IngredientOrderDetails } from "@/src/components/Dashboard/Ingredients/IngredientOrderDetails/IngredientOrderDetails";
import { getSingleIngredientOrderReq } from "@/src/services/dashboard/ingredient/ingredient.service";
import { TIngredientOrder } from "@/src/types/ingredient.type";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialData: TIngredientOrder = await getSingleIngredientOrderReq(id);

  return <IngredientOrderDetails orderData={initialData} />;
}
