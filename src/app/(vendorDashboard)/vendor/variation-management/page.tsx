import { notFound } from "next/navigation";

/**
 * Variation Management is hidden for now (19 Oct 2026): the sidebar link is
 * commented out and this route answers "not found". The original page is kept
 * below, commented out — restore it by uncommenting and removing this export.
 */
export default function VariationManagementPage() {
  notFound();
}

// import { serverRequest } from "@/lib/serverFetch";
// import VariationManagement from "@/src/components/Dashboard/Products/VariationManagement/VariationManagement";
// import { TMeta, TResponse } from "@/src/types";
// import { TProduct } from "@/src/types/product.type";
// import { TVendor } from "@/src/types/vendor.type";
// import { getVendorInfo } from "@/src/utils/getVendorInfo";
// import {
//   matchesVariationsFilter,
//   summarizeVariations,
//   TVariationSummary,
//   variationsFilter,
// } from "@/src/utils/variationSummary";
// import { isRedirectError } from "next/dist/client/components/redirect-error";
//
// interface IProps {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }
//
// /** Products per request when the whole catalogue is needed. */
// const ALL_PAGE_SIZE = 500;
//
// /**
//  * Every product matching `params`, a page of 500 at a time. The backend can't
//  * filter on "has variations", so that filter and the counts work from this.
//  */
// async function getAllProducts(params: Record<string, string | number>, lang: string) {
//   const all: TProduct[] = [];
//   for (let page = 1; ; page++) {
//     const result = (await serverRequest.get("/products", {
//       params: { ...params, limit: ALL_PAGE_SIZE, page },
//       headers: { "Accept-Language": lang },
//     })) as unknown as TResponse<TProduct[]>;
//     if (!result?.success) throw new Error(result?.message || "Failed to load products");
//     all.push(...(result.data ?? []));
//     const totalPage = result.meta?.totalPage ?? 1;
//     if (page >= totalPage || !result.data?.length) return all;
//   }
// }
//
// export default async function VariationManagementPage({
//   searchParams,
// }: IProps) {
//   const vendorInfo = await getVendorInfo();
//   const queries = (await searchParams) || {};
//   const limit = Number(queries?.limit || 10);
//   const page = Number(queries.page || 1);
//   const searchTerm = queries.searchTerm || "";
//   const sortBy = queries.sortBy || "-createdAt";
//   const availability = queries.status || "";
//   const lang = (queries.lang as string) || "en";
//   const variations = variationsFilter(queries.variations);
//
//   const query = {
//     sortBy: sortBy as string,
//     ...(searchTerm ? { searchTerm: searchTerm as string } : {}),
//     ...(availability ? { "stock.availabilityStatus": availability as string } : {}),
//   };
//
//   const initialData: { data: TProduct[]; meta?: TMeta } = { data: [] };
//   let summary: TVariationSummary | null = null;
//
//   // The counts cover the whole catalogue (only the variations are fetched), so
//   // they don't depend on the page, the search or the filters.
//   const summaryRequest = getAllProducts({ fields: "variations" }, lang)
//     .then((all) => {
//       summary = summarizeVariations(all);
//     })
//     .catch((err) => {
//       console.log("Variation summary fetch error:", err);
//       if (isRedirectError(err)) throw err;
//     });
//
//   const listRequest = (async () => {
//     try {
//       if (variations) {
//         // Filtered here, then paged: the backend has no filter for this.
//         const matching = (await getAllProducts(query, lang)).filter((product) =>
//           matchesVariationsFilter(product, variations),
//         );
//         initialData.data = matching.slice((page - 1) * limit, page * limit);
//         initialData.meta = {
//           page,
//           limit,
//           total: matching.length,
//           totalPage: Math.ceil(matching.length / limit),
//         };
//         return;
//       }
//
//       const result = (await serverRequest.get("/products", {
//         params: { ...query, limit, page },
//         headers: {
//           "Accept-Language": lang
//         }
//       })) as unknown as TResponse<TProduct[]>;
//
//       if (result?.success) {
//         initialData.data = result?.data;
//         initialData.meta = result?.meta;
//       }
//     } catch (err) {
//       console.log("Server fetch error:", err);
//       if (isRedirectError(err)) throw err;
//     }
//   })();
//
//   await Promise.all([summaryRequest, listRequest]);
//
//   return (
//     <VariationManagement
//       productsData={initialData}
//       summary={summary}
//       vendor={(vendorInfo?.vendor as TVendor) || {}}
//     />
//   );
// }
