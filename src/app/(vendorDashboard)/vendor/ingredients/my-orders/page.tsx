import MyIngredientOrders from "@/src/components/Dashboard/Ingredients/MyIngredientOrders/MyIngredientOrders";
import { getMyIngredientOrdersReq } from "@/src/services/dashboard/ingredient/ingredient.service";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function MyIngredientOrdersPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const ordersData = await getMyIngredientOrdersReq(queries);

  return <MyIngredientOrders ordersData={ordersData} />;
}
