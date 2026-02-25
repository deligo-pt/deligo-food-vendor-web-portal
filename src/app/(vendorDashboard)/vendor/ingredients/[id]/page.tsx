import IngredientDetail from "@/src/components/Dashboard/Ingredients/IngredientDetails/IngredientDetails";
import { TIngredient } from "@/src/types/ingredient.type";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData: TIngredient = {} as TIngredient;

  // try {
  //   const result = (await serverRequest.get(
  //     `/orders/${id}`,
  //   )) as TResponse<TIngredient>;

  //   if (result?.success) {
  //     initialData = result.data;
  //   }
  // } catch (err) {
  //   console.log("Server fetch error:", err);
  // }

  const initialIngredient: TIngredient = {
    _id: "1",
    ingredientId: "ING-001",
    name: "Large Pizza Box",
    category: "Box",
    description:
      "Standard 12-inch pizza box, corrugated cardboard. Eco-friendly and recyclable material. Perfect for hot pizza delivery. Features steam vents to keep crust crispy.",
    price: 0.5,
    stock: 5000,
    image: "https://vendor-food.deligo.pt/deligoLogo.png",
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-16T00:00:00.000Z",
  };

  initialData = initialIngredient;

  if (!id) console.log("no id");

  return <IngredientDetail ingredient={initialData} />;
}
