import { serverRequest } from "@/lib/serverFetch";
import CustomerReport from "@/src/components/Dashboard/Reports/CustomerReport/CustomerReport";
import { TMeta, TResponse } from "@/src/types";
import { TCustomerReport } from "@/src/types/report.type";

type IProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function CustomerReportPage({ searchParams }: IProps) {
  const queries = (await searchParams) || {};
  const limit = Number(queries?.limit || 10);
  const page = Number(queries.page || 1);
  const searchTerm = queries.searchTerm || "";
  const sortBy = queries.sortBy || "-createdAt";
  const status = queries.status || "";

  const query = {
    limit,
    page,
    sortBy,
    ...(searchTerm ? { searchTerm: searchTerm } : {}),
    ...(status ? { status: status } : {}),
    isDeleted: false,
  };

  const initialData: { data: TCustomerReport; meta?: TMeta } = {
    data: {} as TCustomerReport,
  };

  try {
    const result = (await serverRequest.get(
      "/analytics/vendor-customer-report",
      {
        params: query,
      },
    )) as TResponse<TCustomerReport>;

    if (result?.success) {
      initialData.data = result.data;
      initialData.meta = result.meta;
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return <CustomerReport customerReportData={initialData} />;
}
