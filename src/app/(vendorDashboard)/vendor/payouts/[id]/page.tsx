import { serverRequest } from "@/lib/serverFetch";
import PayoutDetails from "@/src/components/Dashboard/Payments/Payouts/PayoutDetails";
import { TResponse } from "@/src/types";
import { TPayout } from "@/src/types/payout.type";

export default async function PayoutDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let initialData: TPayout = {} as TPayout;

  try {
    const result = (await serverRequest.get(
      `/payouts/${id}`,
    )) as TResponse<TPayout>;

    if (result?.success) {
      initialData = result.data || {};
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <PayoutDetails payout={initialData} />;
}
