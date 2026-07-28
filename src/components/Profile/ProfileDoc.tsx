import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import Image from "next/image";

export interface IVendorDocs {
  businessLicenseDoc?: string[];
  taxDoc?: string[];
  idProofFront?: string[];
  idProofBack?: string[];
  storePhoto?: string[];
  menuUpload?: string[];
  agoserisHaccpCertificate?: string[];
  ibanProof?: string[];
}

interface IProps {
  documents: IVendorDocs | undefined;
}

export default function ProfileDoc({ documents }: IProps) {
  const { t } = useTranslation();
  const docsArr = Object.keys(documents || {}) as (keyof IVendorDocs)[];

  return (
    <div>
      {docsArr.map((doc, i) => {
        const files = documents?.[doc];

        if (!files || files.length === 0) return null;

        return (
          <motion.div
            key={i}
            whileHover={{
              x: 4,
            }}
          >
            <p className="text-sm text-gray-500 mb-2">
              {doc === "idProofFront" && t("id_proof_front")}
              {doc === "idProofBack" && t("id_proof_back")}
              {doc === "businessLicenseDoc" && t("documentsLabel1")}
              {doc === "taxDoc" && t("documentsLabel2")}
              {doc === "storePhoto" && t("documentsLabel4")}
              {doc === "menuUpload" && t("documentsLabel5")}
              {doc === "agoserisHaccpCertificate" && t("agoserisHaccpCertificate")}
              {doc === "ibanProof" && t("iban_proof")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {files.map((file, index) => {
                const isPdf = file.toLowerCase().endsWith(".pdf");

                return (
                  <div key={index}>
                    {isPdf ? (
                      <iframe
                        src={file}
                        className="w-full h-40 rounded-lg border border-gray-200"
                      />
                    ) : (
                      <Image
                        src={file}
                        alt={`${doc}-${index}`}
                        width={500}
                        height={500}
                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      />
                    )}

                    <motion.a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-sm text-[#DC3173] hover:underline inline-block"
                    >
                      {t("view_full_file")}
                    </motion.a>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )
      })}


      {docsArr.length === 0 && (
        <p className="text-gray-500 italic col-span-2">
          {t("no_documents_uploaded")}
        </p>
      )}
    </div>
  );
}
