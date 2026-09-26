/**
 * The picture a product falls back to when the vendor uploads none.
 *
 * A real storage URL, not `/dl1.png` from this app's `public/` folder: the
 * backend stores whatever it is given and the **customer app** renders it, so a
 * path that only resolves on the vendor portal's own domain would show as a
 * broken image to every customer. The file was uploaded once through
 * `POST /uploads`, which is also what converted it to webp.
 *
 * Environment-specific by nature — this URL is on the **test** storage. Set
 * `NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE` in production to the URL that
 * re-uploading `public/dl1.png` there returns.
 */
export const DEFAULT_PRODUCT_IMAGE =
  process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE ||
  "https://storage-test.deligo.pt/deligo-food-server/uploads/8rrfmh4ysm8-1790434109394-files-dl1.webp";

/** A product carries one image. The default fills the slot when none is given. */
export const MAX_PRODUCT_IMAGES = 1;
