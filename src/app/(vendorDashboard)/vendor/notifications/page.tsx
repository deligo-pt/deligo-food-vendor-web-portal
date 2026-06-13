import { serverRequest } from "@/lib/serverFetch";
import VendorNotificationsContent, {
  TVendorNotification,
} from "@/src/components/vendorNotifications/VendorNotificationsContent";
import { TMeta, TResponse } from "@/src/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function VendorNotificationsPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries?.page || 1);

  const initialData: { data: TVendorNotification[]; meta?: TMeta } = {
    data: [],
  };

  try {
    const result = (await serverRequest.get("/notifications/my-notifications", {
      params: { limit, page },
    })) as TResponse<TVendorNotification[]>;

    if (result?.success) {
      initialData.data = result.data;
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.log("Server fetch notifications error:", err);
    if (isRedirectError(err)) throw err;
  }

  return (
    <VendorNotificationsContent
      initialNotifications={initialData.data}
      meta={initialData.meta}
    />
  );
}
