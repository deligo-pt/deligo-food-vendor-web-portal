import { serverRequest } from "@/lib/serverFetch";
import UploadDocuments from "@/src/components/BecomeVendor/UploadDocuments";
import { DocKey, FilePreview } from "@/src/types/documents.type";
import { getVendorInfo } from "@/src/utils/getVendorInfo";

export default async function UploadDocumentPage() {
  const vendorDetails = await getVendorInfo();

  if (!vendorDetails) {
    return <div className="p-4 text-center">Unable to fetch vendor details. Please try again later.</div>;
  };

  const savedPreviews: Record<DocKey, FilePreview[] | null> = {} as Record<
    DocKey,
    FilePreview[] | null
  >;

  try {
    const result = await serverRequest.get(`/vendors/${vendorDetails?.vendor?.userId}`);

    if (result?.success) {
      const docs = result?.data?.documents || {};
      (Object.keys(docs) as DocKey[]).forEach((key) => {
        const urls = docs[key];

        if (urls && Array.isArray(urls)) {
          savedPreviews[key] = urls.map((url) => ({
            file: null,
            url: url || "",
            isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(url),
          }));
        }
      });
    }
  } catch (err) {
    console.log("Server fetch error:", err);
  }

  return (
    <UploadDocuments savedPreviews={savedPreviews} vendor={vendorDetails?.vendor} />
  );
}
