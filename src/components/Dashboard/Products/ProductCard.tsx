"use client";

import { useStore } from "@/src/store/store";
import { TProduct } from "@/src/types/product.type";
import { motion } from "framer-motion";
import { Check, Clock, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IProps {
  product: TProduct;
  onEdit: (product: TProduct) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
  /** Selection is off unless the catalogue asks for it, so the card is unchanged by default. */
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (product: TProduct) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  t,
  selectable = false,
  selected = false,
  onToggleSelect,
}: IProps) {
  const { lang } = useStore();
  const router = useRouter();

  const statusColors = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    DELETED: "bg-red-100 text-red-800",
  };

  const availabilityColors = {
    "In Stock": "bg-green-100 text-green-800",
    "Out of Stock": "bg-red-100 text-red-800",
    Limited: "bg-yellow-100 text-yellow-800",
  };

  // VAT helpers (supports common field names)
  const taxPercentage = product.pricing?.taxRate ?? null;
  const taxAmount = product.pricing?.taxAmount ?? null;

  const hasTax =
    (taxAmount !== null && taxAmount !== undefined);

  return (
    <motion.div
      onClick={selectable ? () => onToggleSelect?.(product) : undefined}
      // `h-full` + a column: the grid stretches the card, and without this the
      // spare height pooled at the bottom instead of being distributed, so two
      // cards in the same row put their buttons at different heights.
      className={`flex h-full flex-col bg-white rounded-lg shadow-md overflow-hidden border transition-all ${selectable ? "cursor-pointer" : ""
        } ${selected
          ? "border-[#DC3173] ring-2 ring-[#DC3173]/30"
          : "border-gray-100"
        }`}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 20px rgba(220, 49, 115, 0.15)",
        transition: {
          duration: 0.2,
        },
      }}
    >
      <div className="relative h-48 shrink-0 flex items-center justify-center overflow-hidden">
        {/* A brand wash over the photo while selected. The mark tells you which
            card; this tells you at a glance how many, without reading corners. */}
        {selectable && selected && (
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[#DC3173]/15"
            aria-hidden="true"
          />
        )}
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product?.name?.[lang] as string}
            // `cover`, not `fill`: `fill` stretches a photo to the box, which
            // is why a wide banner and a square dish looked differently
            // proportioned side by side.
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {/* {product.meta.isFeatured && (
          <div className="absolute top-2 right-2 z-[2] bg-[#DC3173] text-white text-xs font-bold px-2 py-1 rounded-md">
            Featured
          </div>
        )} */}
        <div
          className={`absolute top-2 left-2 z-[2] text-xs font-medium px-2 py-1 rounded-md ${statusColors[
            product.isDeleted ? "DELETED" : product.meta.status
          ]
            }`}
        >
          {product.isDeleted ? "DELETED" : product.meta.status}
        </div>
        {product?.pricing?.discount && <div
          className={`absolute top-2 right-2 z-[2] text-xs font-medium px-2 py-1 rounded-md bg-[#DC3173] text-white`}
        >
          {product.pricing?.discount} % OFF
        </div>}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {product.name?.[lang]}
          </h3>
          <div className="flex items-center">
            <Star
              className="h-4 w-4 text-yellow-400 mr-1"
              fill="currentColor"
            />
            <span className="text-sm font-medium">
              {product.rating ? product.rating.average.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>

        {/* Rendered even when empty. Dropping the element moved the price and
            the buttons up by two lines, so a product without a description
            never lined up with the one beside it. */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description?.[lang]}
        </p>

        {/* Price + VAT section.

            🔴 Two fixed rows, never one wrapping row. Price, struck-through
            original and the VAT used to share a single `flex-wrap` line, so
            whether the tax fit beside the price depended on how long that
            particular price happened to be: "€ 9,00 €10,00 · Inc. VAT 6%" fits,
            "EUR 0,40 EUR 1,00 · Inc. VAT 13%" does not. One card's block was a
            line tall, its neighbour's two, and the divider and buttons below
            them sat at different heights across a row of cards.

            Giving VAT its own line makes the shape the same by construction
            rather than by measurement — which also survives Portuguese, where
            the API returns "EUR" and it renders wider than "€". */}
        <div className="mb-3 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="text-lg font-bold text-[#DC3173]">
                {product.pricing.currency}{" "}
                {new Intl.NumberFormat("de-DE", {
                  minimumFractionDigits: 2,
                }).format(product.pricing.finalPrice)}
              </span>

              {product?.pricing?.discount ? (
                <span className="text-xs line-through text-gray-400">
                  {product.pricing.currency}{" "}
                  {new Intl.NumberFormat("de-DE", {
                    minimumFractionDigits: 2,
                  }).format(product.pricing.price)}
                </span>
              ) : null}

            </div>

            {product.stock?.availabilityStatus && (
              <div
                className={`shrink-0 text-xs px-2 py-1 rounded-full ${availabilityColors[product.stock.availabilityStatus]
                  }`}
              >
                {product.stock.availabilityStatus}
              </div>
            )}
          </div>

          {/* The line is rendered whether or not there is a tax, for the same
              reason the description is: dropping it would pull everything below
              up by one line, and a product without VAT would stop lining up
              with the one beside it. */}
          <div className="flex min-h-[1.5rem] items-center gap-1 text-xs text-gray-500">
            {hasTax && (
              <>
                <span className="font-medium text-gray-600">{t("inc_vat")}</span>

                {taxPercentage !== null && taxPercentage !== undefined && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-700">
                    {taxPercentage}%
                  </span>
                )}

                {taxAmount !== null && taxAmount !== undefined && (
                  <span>
                    ({product.pricing.currency}{" "}
                    {new Intl.NumberFormat("de-DE", {
                      minimumFractionDigits: 2,
                    }).format(taxAmount)}
                    )
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {product.deliveryInfo && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Clock className="h-3 w-3 mr-1" />
            <span>{product.deliveryInfo.deliveryType}</span>
            {product.deliveryInfo.estimatedTime && (
              <span className="ml-1">
                • {product.deliveryInfo.estimatedTime}
              </span>
            )}
          </div>
        )}

        {/* `flex-wrap`: the button group is `shrink-0`, so on a narrow card the
            row used to overflow and press the tick flat against View — worst
            on products with no vendor name, where nothing sits between them to
            absorb it. Wrapping drops the buttons to their own line instead;
            at normal widths nothing moves. */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-3 pt-3 border-t border-gray-100">
          {/* The tick lives here rather than over the photo: this row is always
              white, so the mark cannot be lost against a pink dish, and it sits
              beside the controls the vendor is already looking at. It stays
              *outside* the button group below, which stops propagation so
              View/Edit/Delete still work while selecting — inside it, the tick
              would never toggle anything. */}
          <div className="flex min-w-0 items-center gap-2">
            {selectable && (
              <span
                className={`mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${selected
                  ? "border-[#DC3173] bg-[#DC3173] text-white"
                  // Empty box, brand border: grey read as disabled, and the
                  // control is the one thing on the card that has to look
                  // clickable before anything is picked. The faint tick inside
                  // says what it will become without claiming it already is.
                  : "border-[#DC3173] bg-white text-[#DC3173]/25"
                  }`}
                aria-hidden="true"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
            )}
            <span className="truncate text-xs text-gray-500">
              {product.vendor?.vendorName}
            </span>
          </div>
          <div
            className="flex shrink-0 space-x-2"
            onClick={(event) => event.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                router.push(`/vendor/all-items/${product.productId}`)
              }
              className="text-xs px-3 py-1 rounded-md border border-[#DC3173] text-[#DC3173] hover:bg-[#DC3173] hover:text-white transition-colors"
            >
              {t("view")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(product)}
              className="text-xs px-3 py-1 rounded-md border border-[#DC3173] text-[#DC3173] hover:bg-[#DC3173] hover:text-white transition-colors"
            >
              {t("edit")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(product.productId)}
              className="text-xs px-3 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            >
              {t("delete")}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}