import { serverRequest } from "@/lib/serverFetch";
import SalesReport from "@/src/components/Dashboard/Reports/SalesReport/SalesReport";
import { TMeta, TResponse } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { TSalesReport } from "@/src/types/report.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function SalesReportPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const orderStatus = queries.orderStatus || "";

  const query = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm } : {}),
    ...(orderStatus ? { orderStatus } : {}),
  };

  const initialData: { data: TSalesReport; meta?: TMeta } = {
    data: {} as TSalesReport,
  };

  try {
    const result = (await serverRequest.get(
      "/analytics/vendor-sales-report-analytics",
      {
        params: query,
      },
    )) as TResponse<TSalesReport>;

    if (result?.success) {
      initialData.data = result.data;
      // initialData.meta = result.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  try {
    const result = (await serverRequest.get("/orders", {
      params: query,
    })) as TResponse<TOrder[]>;

    if (result?.success) {
      initialData.data.orders = result.data;
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <SalesReport salesReportData={initialData} />;
}
