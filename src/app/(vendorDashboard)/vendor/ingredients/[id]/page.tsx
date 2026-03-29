import IngredientDetail from "@/src/components/Dashboard/Ingredients/IngredientDetails/IngredientDetails";
import { getSingleIngredientReq } from "@/src/services/dashboard/ingredient/ingredient.service";
import { TIngredient } from "@/src/types/ingredient.type";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient: TIngredient = await getSingleIngredientReq(id);

  return <IngredientDetail ingredient={ingredient} />;
}
