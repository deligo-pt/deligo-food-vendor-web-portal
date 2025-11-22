export type DocKey =
  | "businessLicenseDoc"
  | "taxDoc"
  | "idProof"
  | "storePhoto"
  | "menuUpload";

export type FilePreview = {
  file: File | null;
  url: string | null;
  isImage: boolean;
};
