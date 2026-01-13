import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import Image from "next/image";

interface IDocs {
  businessLicenseDoc?: string | undefined;
  taxDoc?: string | undefined;
  idProof?: string | undefined;
  storePhoto?: string | undefined;
  menuUpload?: string | undefined;
}
interface IProps {
  documents: IDocs | undefined;
}

export default function ProfileDoc({ documents }: IProps) {
  const { t } = useTranslation();
  const docsArr = Object.keys(documents || {}).filter(
    (key) => !!documents?.[key as keyof IDocs]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {docsArr.map((doc, i) => (
        <motion.div
          key={i}
          whileHover={{
            x: 4,
          }}
        >
          <p className="text-sm text-gray-500 mb-2">
            {doc === "idProof" && t("id_proof")}
            {doc === "businessLicenseDoc" && t("business_license")}
            {doc === "taxDoc" && t("tax_document")}
            {doc === "storePhoto" && t("store_photo")}
            {doc === "menuUpload" && t("menu_brochure")}
          </p>
          {documents?.[doc as keyof IDocs]?.toLowerCase()?.endsWith(".pdf") ? (
            <iframe
              src={documents?.[doc as keyof IDocs] || ""}
              className="w-full h-40 rounded-lg  border 
              border-gray-200"
              allow="fullscreen"
            />
          ) : (
            <Image
              src={documents?.[doc as keyof IDocs] || ""}
              alt={doc || "Document"}
              className="w-full h-40 object-cover rounded-lg border border-gray-200"
              width={500}
              height={500}
              loading="eager"
              priority
            />
          )}
          <motion.a
            href={documents?.[doc as keyof IDocs] || ""}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#DC3173] hover:bg-[#DC3173]/10 rounded-lg"
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            {t("view")}
          </motion.a>
        </motion.div>
      ))}
    </div>
  );
}
