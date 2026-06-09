export type DocKey =
  | "myPhoto"
  | "businessLicenseDoc"
  | "taxDoc"
  | "idProofFront"
  | "idProofBack"
  | "storePhoto"
  | "menuUpload"
  | "agoserisHaccpCertificate";

export type FilePreview = {
  file: File | null;
  url: string | null;
  isImage: boolean;
};
