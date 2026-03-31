import PaymentSuccess from "@/src/components/Dashboard/Ingredients/IngredientPayments/PaymentSuccess";
import { createIngredientOrderReq } from "@/src/services/dashboard/ingredient/ingredient.service";
import Link from "next/link";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string; token: string }>;
}) {
  const { orderId, token } = await searchParams;

  if (!orderId || !token) {
    return (
      <div className="p-4 text-center h-full flex items-center justify-center">
        <div className="p-6 bg-white rounded-md shadow-lg md:min-h-[300px] md:min-w-[600px] flex flex-col items-center justify-center">
          Invalid payment confirmation details.
          <div className="text-center mt-1">
            <Link
              href="/vendor/ingredients"
              className="text-blue-500 hover:underline text-sm"
            >
              Go to Ingredients
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const result = await createIngredientOrderReq({
    orderId,
    paymentToken: token,
  });

  if (!result?.success) {
    return (
      <div className="p-4 text-center h-full flex items-center justify-center">
        <div className="p-6 bg-white rounded-md shadow-lg md:min-h-[300px] md:min-w-[600px] flex flex-col items-center justify-center">
          {result?.message || "Payment confirmation failed. Please try again."}
          <div className="text-center mt-1">
            <Link
              href="/vendor/ingredients/my-orders"
              className="text-blue-500 hover:underline text-sm"
            >
              Go to My Ingredient Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PaymentSuccess />;
}
