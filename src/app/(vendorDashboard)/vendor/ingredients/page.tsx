import Ingredients from "@/src/components/Dashboard/Ingredients/Ingredients/Ingredients";
import { getAllIngredientsReq } from "@/src/services/dashboard/ingredient/ingredient.service";
type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function IngredientsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const ingredientsData = await getAllIngredientsReq(queries);

  return <Ingredients ingredientsData={ingredientsData} />;
}
