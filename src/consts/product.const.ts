/**
 * The picture a product falls back to when the vendor uploads none.
 *
 * A real storage URL, not `/dlgg.png` from this app's `public/` folder: the
 * backend stores whatever it is given and the **customer app** renders it, so a
 * path that only resolves on the vendor portal's own domain would show as a
 * broken image to every customer. The file was uploaded once through
 * `POST /uploads`, which is also what converted it to webp.
 *
 * `public/dlgg.png` since 30 Sep 2026; it was `public/dl1.png` before — see
 * `PREVIOUS_DEFAULT_PRODUCT_IMAGES`.
 *
 * Environment-specific by nature — this URL is on the **test** storage. Set
 * `NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE` in production to the URL that
 * re-uploading `public/dlgg.png` there returns.
 */
export const DEFAULT_PRODUCT_IMAGE =
  process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE ||
  "https://storage-test.deligo.pt/deligo-food-server/uploads/ro24m7fbek7-1790776008453-files-dlgg.webp";

/**
 * Defaults that were current once, and that products saved back then still
 * carry: changing the default does not rewrite them. They are still defaults,
 * not pictures a vendor uploaded — see `isDefaultProductImage`.
 */
export const PREVIOUS_DEFAULT_PRODUCT_IMAGES: readonly string[] = [
  // public/dl1.png, the default until 30 Sep 2026.
  "https://storage-test.deligo.pt/deligo-food-server/uploads/8rrfmh4ysm8-1790434109394-files-dl1.webp",
];

/** Whether a product's picture is a fallback — current or past — rather than an upload. */
export const isDefaultProductImage = (url: string | null | undefined): boolean =>
  !!url && (url === DEFAULT_PRODUCT_IMAGE || PREVIOUS_DEFAULT_PRODUCT_IMAGES.includes(url));

/** A product carries one image. The default fills the slot when none is given. */
export const MAX_PRODUCT_IMAGES = 1;

/**
 * A product's picture, wherever it happens to live.
 *
 * The API changed from `images: [url]` to `image: url` in Sep 2026 without
 * migrating the rows behind it, so the collection holds both shapes at once:
 * products saved before the change have `images` and no `image`, products saved
 * after have `image` and no `images` (measured against the test API). Reading
 * either field on its own therefore loses half the catalogue.
 *
 * `image` is checked first because it is the shape the API now writes, so a
 * product that somehow carries both is showing the newer picture.
 */
export const getProductImage = (product?: {
  image?: string;
  images?: string[];
} | null): string | undefined => product?.image || product?.images?.[0];
