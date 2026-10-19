/**
 * What a product photo should be (6 Oct 2026; pixels relaxed 19 Oct 2026).
 *
 * - **Format:** JPG, PNG or WEBP — blocks the upload.
 * - **File size:** at most 5 MB — blocks the upload.
 * - **Pixels:** square, at least 1200 × 1200 — a **recommendation**: any size
 *   uploads, and a smaller or non-square photo gets a warning (the customer
 *   app shows photos in square frames, so it may be cropped or look soft).
 *
 * Nothing is resized or compressed here; the vendor prepares the file. Checked
 * in the browser before anything is sent. The backend's `/uploads` should
 * enforce format and size too, since a browser check can be bypassed.
 *
 * Pure, with no imports, so `pnpm verify:product-image` runs it directly. Each
 * problem is a translation key plus the values it names; the uploader
 * translates it.
 */
export const PRODUCT_IMAGE_MIN_PX = 1200;
export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
/** For the file picker's `accept`, so it offers only these. Drag and drop still needs the check. */
export const PRODUCT_IMAGE_ACCEPT = PRODUCT_IMAGE_TYPES.join(",");

/** Some systems leave `type` empty; the extension decides then. */
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export type ImageProblem = { key: string; vars?: Record<string, string> };

/** Megabytes with one decimal, for messages: 7340032 bytes → "7.0". */
export function formatMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

/** Format and file size: everything knowable without opening the image. */
export function checkImageFile(file: { type?: string; size: number; name?: string }): ImageProblem | null {
  const type = (file.type ?? "").toLowerCase();
  const ext = (file.name ?? "").toLowerCase().split(".").pop() ?? "";
  const allowed = type
    ? (PRODUCT_IMAGE_TYPES as readonly string[]).includes(type)
    : EXTENSIONS.includes(ext);
  if (!allowed) return { key: "img_err_type" };
  if (file.size > PRODUCT_IMAGE_MAX_BYTES) return { key: "img_err_too_large", vars: { size: formatMb(file.size) } };
  return null;
}

/** A file that can't be decoded is refused — there is no picture to upload. */
export function checkImageReadable(width: number, height: number): ImageProblem | null {
  return width > 0 && height > 0 ? null : { key: "img_err_unreadable" };
}

/**
 * The recommended size: square, at least `PRODUCT_IMAGE_MIN_PX` on a side.
 * Returns a **warning** (the upload still goes ahead), or `null`.
 */
export function checkImageDimensions(width: number, height: number): ImageProblem | null {
  const vars = { w: String(width), h: String(height) };
  if (width !== height) return { key: "img_warn_not_square", vars };
  if (width < PRODUCT_IMAGE_MIN_PX) return { key: "img_warn_too_small", vars };
  return null;
}
