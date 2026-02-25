import MyIngredientOrders from "@/src/components/Dashboard/Ingredients/MyIngredientOrders/MyIngredientOrders";
import { TMeta } from "@/src/types";
import { TIngredientOrder } from "@/src/types/ingredient.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function MyIngredientOrdersPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";

  const query = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
  };

  const initialData: { data: TIngredientOrder[]; meta?: TMeta } = { data: [] };

  //   try {
  //     const result = (await serverRequest.get("/ingredient-orders", {
  //       params: query,
  //     })) as TResponse<TIngredientOrder[]>;

  //     if (result?.success) {
  //       initialData.data = result.data;
  //       initialData.meta = result.meta;
  //     }
  //   } catch (err) {
  //     console.log("Server fetch error:", err);
  //   }

  const initialOrders: TIngredientOrder[] = [
    {
      _id: "ORD-001",
      orderId: "ORD-001",
      ingredients: [
        {
          ingredientId: "ING-001",
          name: "Tomato Sauce",
          category: "Sauces",
          quantity: 3,
        },
      ],
      totalPrice: 45.5,
      status: "DELIVERED",
      createdAt: "2026-01-15T10:00:00Z",
      updatedAt: "2026-01-16T15:30:00Z",
    },
    {
      _id: "ORD-002",
      orderId: "ORD-002",
      ingredients: [
        {
          ingredientId: "ING-002",
          name: "Burger Buns",
          category: "Bread",
          quantity: 10,
        },
      ],
      totalPrice: 125.0,
      status: "APPROVED",
      createdAt: "2026-01-10T14:20:00Z",
      updatedAt: "2026-01-11T09:45:00Z",
    },
    {
      _id: "ORD-003",
      orderId: "ORD-003",
      ingredients: [
        {
          ingredientId: "ING-003",
          name: "Sushi Rice",
          category: "Rice",
          quantity: 5,
        },
      ],
      totalPrice: 12.5,
      status: "REJECTED",
      createdAt: "2026-01-09T12:00:00Z",
      updatedAt: "2026-01-09T16:30:00Z",
    },
    {
      _id: "ORD-004",
      orderId: "ORD-004",
      ingredients: [
        {
          ingredientId: "ING-004",
          name: "Taco Shells",
          category: "Bread",
          quantity: 20,
        },
      ],
      totalPrice: 60.0,
      status: "PENDING",
      createdAt: "2026-01-08T10:30:00Z",
      updatedAt: "2026-01-08T14:45:00Z",
    },
  ];

  initialData.data = initialOrders || [];
  initialData.meta = {
    total: 4,
    totalPage: 1,
    page: 1,
    limit: 10,
  };

  if (!!query) console.log("no query");

  return <MyIngredientOrders ordersData={initialData} />;
}
