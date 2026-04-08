"use server";

import { serverRequest } from "@/lib/serverFetch";
import { TTaxReport } from "@/src/types/report.type";
import { catchAsync } from "@/src/utils/catchAsync";

export const getTaxReport = async () => {
  const result = await catchAsync<TTaxReport>(async () => {
    return await serverRequest.get("/analytics/vendor/tax-report");
  });

  if (result?.success) return result.data;

  return {};
};
