import { IngredientOrderDetails } from "@/src/components/Dashboard/Ingredients/IngredientOrderDetails/IngredientOrderDetails";
import { TIngredientOrder } from "@/src/types/ingredient.type";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData: TIngredientOrder = {} as TIngredientOrder;

  // try {
  //   const result = (await serverRequest.get(
  //     `/orders/${id}`,
  //   )) as TResponse<TIngredientOrder>;

  //   if (result?.success) {
  //     initialData = result.data;
  //   }
  // } catch (err) {
  //   console.log("Server fetch error:", err);
  // }

  const initialOrder: TIngredientOrder = {
    _id: "ORD-001",
    orderId: "ORD-001",
    ingredients: [
      {
        ingredientId: "ING-001",
        name: "Tomato Sauce",
        category: "Sauces",
        price: 3,
        quantity: 3,
        image: "https://vendor-food.deligo.pt/deligoLogo.png",
      },
      {
        ingredientId: "ING-001",
        name: "Tomato Sauce",
        category: "Sauces",
        price: 3,
        quantity: 3,
        image: "https://vendor-food.deligo.pt/deligoLogo.png",
      },
      {
        ingredientId: "ING-001",
        name: "Tomato Sauce",
        category: "Sauces",
        price: 3,
        quantity: 3,
        image: "https://vendor-food.deligo.pt/deligoLogo.png",
      },
    ],
    totalPrice: 27.0,
    status: "DELIVERED",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-16T15:30:00Z",
  };

  initialData = initialOrder;

  if (!id) console.log("no id");

  return <IngredientOrderDetails orderData={initialData} />;
}
