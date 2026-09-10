"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/src/hooks/use-translation";
import { DocumentViewer, IDocSection } from "../Modals/DocumentViewer";
import {
  deleteDocumentReq,
  updateDocumentsReq,
} from "@/src/services/becomeVendor/updateDocuments.service";
import { uploadImagesReq } from "@/src/services/upload/upload.service";

export interface IVendorDocs {
  myPhoto?: string[];
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
  /** Required for upload / delete */
  userId: string;
  /** Optional – parent can refresh its own state */
  onDocumentsChange?: (docs: IVendorDocs) => void;
}

const DOC_TRANSLATION_MAP: Record<keyof IVendorDocs, string> = {
  myPhoto: "myPhoto",
  idProofFront: "id_proof_front",
  idProofBack: "id_proof_back",
  businessLicenseDoc: "business_license",
  taxDoc: "tax_document",
  storePhoto: "store_photo",
  menuUpload: "menu_brochure",
  agoserisHaccpCertificate: "agoserisHaccpCertificate",
  ibanProof: "iban_proof",
};

const UPLOADABLE_KEYS = ["myPhoto", "storePhoto", "menuUpload"] as const;
type UploadableKey = (typeof UPLOADABLE_KEYS)[number];

const DOCUMENT_LIMITS: Record<UploadableKey, number> = {
  myPhoto: 1,
  storePhoto: 3,
  menuUpload: 3,
};

export default function ProfileDoc({
  documents,
  userId,
  onDocumentsChange,
}: IProps) {
  const { t } = useTranslation();
  const inputsRef = useRef<Partial<Record<UploadableKey, HTMLInputElement | null>>>({});

  const [localDocs, setLocalDocs] = useState<IVendorDocs>(documents ?? {});

  const openPicker = (key: UploadableKey) => {
    inputsRef.current[key]?.click();
  };

  const handleFileChange = async (key: UploadableKey, file?: File | null) => {
    if (!file) return;

    // reset native input so the same file can be re-selected
    if (inputsRef.current[key]) {
      inputsRef.current[key]!.value = "";
    }

    let current = [...(localDocs[key] ?? [])];
    const max = DOCUMENT_LIMITS[key];
    const isAtLimit = current.length >= max;

    const toastId = toast.loading(isAtLimit ? "Changing..." : "Uploading...");

    // when at limit → remove the last file first (Change behaviour)
    if (isAtLimit) {
      const urlToRemove = current[current.length - 1];
      const deleteResult = await deleteDocumentReq(userId, {
        docImageTitle: key,
        imageUrl: urlToRemove,
      });

      if (!deleteResult.success) {
        toast.error(deleteResult.message || "Failed to remove previous file", {
          id: toastId,
        });
        return;
      }

      // drop the removed url from the working list
      current = current.slice(0, -1);
    }

    // upload the new file
    const uploadResult = await uploadImagesReq([file]);

    if (!uploadResult.success || !uploadResult.data?.[0]) {
      toast.error(uploadResult.message || "File upload failed", { id: toastId });
      return;
    }

    const newUrl = uploadResult.data[0];
    const newUrls = [...current, newUrl];

    const updateResult = await updateDocumentsReq(userId, {
      docImageTitle: key,
      docImageUrls: newUrls,
    });

    if (!updateResult.success) {
      // best-effort rollback of the just-uploaded file
      await deleteDocumentReq(userId, {
        docImageTitle: key,
        imageUrl: newUrl,
      });
      toast.error(updateResult.message || "File upload failed", { id: toastId });
      return;
    }

    const next = {
      ...localDocs,
      [key]: newUrls,
    };
    setLocalDocs(next);
    onDocumentsChange?.(next);

    toast.success(
      isAtLimit ? "File changed successfully!" : "File uploaded successfully!",
      { id: toastId }
    );
  };

  // Build sections exactly as the original ProfileDoc did
  const sections: IDocSection[] = (
    Object.keys(DOC_TRANSLATION_MAP) as (keyof IVendorDocs)[]
  ).map((key) => ({
    key,
    label: t(DOC_TRANSLATION_MAP[key]),
    files: localDocs[key] || [],
  }));

  return (
    <div className="space-y-6">
      {/* Uploadable documents – title + Add more / Change on the right */}
      <div className="space-y-4">
        {UPLOADABLE_KEYS.map((key) => {
          const label = t(DOC_TRANSLATION_MAP[key]);
          const currentCount = (localDocs[key] || []).length;
          const isAtLimit = currentCount >= DOCUMENT_LIMITS[key];

          return (
            <div key={key} className="space-y-2">
              {/* Title row with Add more / Change button on the right (flex) */}
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
                <button
                  type="button"
                  onClick={() => openPicker(key)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#DC3173] border border-[#DC3173]/30 hover:bg-[#DC3173]/5 transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAtLimit
                    ? t("changeCTA") || "Change"
                    : t("addMoreCTA") || "Add more"}
                </button>
              </div>

              {/* DocumentViewer shows ONLY this section → perfect preview + internal viewer */}
              <DocumentViewer
                sections={[
                  {
                    key,
                    label,
                    files: localDocs[key] || [],
                  },
                ]}
                emptyMessageKey="no_documents_uploaded"
              />

              {/* hidden file input */}
              <input
                ref={(el) => {
                  inputsRef.current[key] = el;
                }}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(key, e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
          );
        })}
      </div>

      {/* ========== All remaining (non-uploadable) documents – pure DocumentViewer ========== */}
      <DocumentViewer
        sections={sections.filter(
          (s) => !UPLOADABLE_KEYS.includes(s.key as UploadableKey)
        )}
        emptyMessageKey="no_documents_uploaded"
      />
    </div>
  );
}