/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import { deleteProductImage } from "@/src/services/dashboard/products/products";
import { uploadImagesReq } from "@/src/services/upload/upload.service";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { MAX_PRODUCT_IMAGES } from "@/src/consts/product.const";
import {
  checkImageDimensions,
  checkImageFile,
  PRODUCT_IMAGE_ACCEPT,
  type ImageProblem,
} from "@/src/utils/productImageRules";

/**
 * The image's width and height, read in the browser without uploading it.
 * `null` when the file can't be decoded (corrupt, or not really an image).
 */
async function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return size;
    } catch {
      // Fall through to <img>, which decodes a few formats some browsers'
      // `createImageBitmap` won't.
    }
  }
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

interface IProps {
  images: string[];
  onChange: (images: string[]) => void;
  productId?: string;
}

export function ImageUpload({ images, onChange, productId }: IProps) {
  const { t } = useTranslation();

  /** A problem as the vendor reads it: the key translated, its values filled in. */
  const describe = ({ key, vars }: ImageProblem) =>
    Object.entries(vars ?? {}).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), t(key));

  /**
   * Every rule in `productImageRules`, before anything is uploaded. Returns the
   * message to show, or `null` when the file may go. Format and size first,
   * since they need no decoding; then the pixels.
   */
  const checkBeforeUpload = async (file: File): Promise<string | null> => {
    const fileProblem = checkImageFile(file);
    if (fileProblem) return describe(fileProblem);
    const size = await readImageSize(file);
    if (!size) return describe({ key: "img_err_unreadable" });
    const sizeProblem = checkImageDimensions(size.width, size.height);
    return sizeProblem ? describe(sizeProblem) : null;
  };
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  /** The hidden picker behind "Replace image". */
  const replaceRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFiles = async (files: FileList) => {
    setError(null);
    // One image per product. A second file is not silently ignored — the
    // vendor is told, because the picture they just chose is the one they
    // expect to see.
    if (images.length + files.length > MAX_PRODUCT_IMAGES) {
      setError(t("only_one_image_allowed"));
      return;
    }
    for (const file of Array.from(files)) {
      const problem = await checkBeforeUpload(file);
      if (problem) {
        setError(problem);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    const toastId = toast.loading(t("Uploading images..."));

    const result = await uploadImagesReq(Array.from(files));

    if (result.success) {
      toast.success(result.message || "Images uploaded successfully!", {
        id: toastId,
      });
      onChange([...images, ...(result.data || [])]);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    toast.error(result.message || "Image upload failed", { id: toastId });
    console.log(result);
  };

  /**
   * Swap the picture without deleting it first.
   *
   * The slot is capped at one, so `handleFiles` would refuse this as "only one
   * image". Replacing is the ordinary way to change a product's photo, and it
   * used to require finding a delete button that only appears on hover, over a
   * thumbnail — which is unusable the moment the thumbnail itself will not
   * render.
   *
   * The previous file is left in storage rather than deleted: the swap is not
   * saved until the vendor saves the product, and deleting here would destroy
   * the old image even if they then cancelled.
   */
  const replaceFile = async (files: FileList) => {
    setError(null);
    const file = files[0];
    if (!file) return;
    const problem = await checkBeforeUpload(file);
    if (problem) {
      setError(problem);
      if (replaceRef.current) replaceRef.current.value = "";
      return;
    }

    const toastId = toast.loading(t("Uploading images..."));
    const result = await uploadImagesReq([file]);

    if (result.success && result.data?.[0]) {
      toast.success(result.message || "Images uploaded successfully!", { id: toastId });
      onChange([result.data[0]]);
      if (replaceRef.current) replaceRef.current.value = "";
      return;
    }

    toast.error(result.message || "Image upload failed", { id: toastId });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = async (image: string, index: number) => {
    const previousImages = [...images];

    // optimistic UI
    onChange(images.filter((_, i) => i !== index));
    if (inputRef.current) inputRef.current.value = "";

    if (!productId) return;

    const toastId = toast.loading("Removing product image...");
    setIsRemoving(true);

    try {
      const res = await deleteProductImage(productId, { images: [image] });

      if (res?.success) {
        toast.success(res?.message || "Image removed successfully", { id: toastId });
      } else {
        // restore on failure
        onChange(previousImages);
        toast.error(res?.message || "Image remove failed!", { id: toastId });
      }
    } catch (error: any) {
      onChange(previousImages);
      toast.error(
        error?.response?.data?.message || error?.message || "Image remove failed",
        { id: toastId }
      );
    } finally {
      setIsRemoving(false);
    }
  };

  const slotTaken = images.length >= MAX_PRODUCT_IMAGES;

  return (
    <div className="space-y-4">
      {/* Hidden once an image is in: the cap is one, so an upload control here
          could only ever answer with the "one image" error. Removing the
          picture brings it back. */}
      {!slotTaken && (
      <div
        onDragEnter={handleDrag}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive
          ? "border-[#DC3173] bg-pink-50"
          : "border-gray-300 hover:border-gray-400"
          } transition-colors duration-200`}
      >
        {dragActive && (
          <div
            className="absolute inset-0 z-10"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />
        )}
        <motion.div
          initial={{
            scale: 0.9,
          }}
          animate={{
            scale: 1,
          }}
          className="flex flex-col items-center"
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-lg font-medium text-gray-700">
            {t("drag_drop_product_image")}
          </p>
          <p className="text-sm text-gray-500 mt-1">{t("or_click")}</p>
          {/* The rules `checkBeforeUpload` enforces, stated before the vendor
              picks a file. */}
          <dl className="mt-3 grid grid-cols-[auto_auto] gap-x-3 gap-y-1 rounded-lg border border-[#DC3173]/15 bg-[#DC3173]/5 px-4 py-2.5 text-left text-xs">
            <dt className="font-medium text-gray-500">{t("img_spec_size")}</dt>
            <dd className="font-semibold text-gray-800">{t("img_spec_size_value")}</dd>
            <dt className="font-medium text-gray-500">{t("img_spec_max")}</dt>
            <dd className="font-semibold text-gray-800">5 MB</dd>
            <dt className="font-medium text-gray-500">{t("img_spec_format")}</dt>
            <dd className="font-semibold text-gray-800">JPG / PNG / WEBP</dd>
          </dl>
          <label className="mt-4">
            <motion.span
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="inline-flex items-center px-4 py-2 bg-[#DC3173] text-white rounded-md cursor-pointer hover:bg-[#B02458] transition-colors"
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              {t("select_file")}
            </motion.span>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept={PRODUCT_IMAGE_ACCEPT}
            />
          </label>
        </motion.div>
      </div>
      )}
      {error && (
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}
      {images.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-700">
              {t("uploaded_images")} ({images.length}/{MAX_PRODUCT_IMAGES})
            </h3>
            {/* Always visible, and never dependent on the thumbnail rendering:
                the delete control next to it only appears on hover, over the
                picture itself. */}
            <label className="inline-flex items-center gap-2 rounded-lg border border-[#DC3173] px-3 py-1.5 text-sm font-medium text-[#DC3173] cursor-pointer hover:bg-[#DC3173]/5 transition-colors">
              <UploadIcon className="h-4 w-4" />
              {t("replace_image")}
              <input
                ref={replaceRef}
                type="file"
                className="hidden"
                accept={PRODUCT_IMAGE_ACCEPT}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) replaceFile(e.target.files);
                }}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  className="relative group aspect-square"
                >
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    width={500}
                    height={500}
                  />
                  <motion.button
                    type="button"
                    whileHover={{
                      scale: 1.1,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    disabled={isRemoving}
                    onClick={() => removeImage(image, index)}
                    className={`absolute -top-2 -right-2 text-white rounded-full p-1 ${isRemoving ? "bg-red-500 opacity-50" : "bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"}`}
                  >
                    <XIcon className="h-4 w-4" />
                  </motion.button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-[#DC3173] text-white text-xs py-1 text-center rounded-b-lg">
                      {t("main_image")}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
