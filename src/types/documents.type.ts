export type DocKey =
  | "myPhoto"
  | "businessLicenseDoc"
  | "taxDoc"
  | "idProofFront"
  | "idProofBack"
  | "storePhoto"
  | "menuUpload"
  | "agoserisHaccpCertificate"
  | "ibanProof";

export type FilePreview = {
  file: File | null;
  url: string | null;
  isImage: boolean;
};
