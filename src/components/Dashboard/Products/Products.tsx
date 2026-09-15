"use client";

import DeleteProductDialog from "@/src/components/Dashboard/Products/DeleteProductDialog";
import EditProductDialog from "@/src/components/Dashboard/Products/EditProductDialog";
import ProductCard from "@/src/components/Dashboard/Products/ProductCard";
import AllFilters from "@/src/components/Filtering/AllFilters";
import { useTranslation } from "@/src/hooks/use-translation";
import { deleteProductReq } from "@/src/services/dashboard/products/products";
import { TMeta } from "@/src/types";
import { TProductCategory } from "@/src/types/category.type";
import { TProduct } from "@/src/types/product.type";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface IProps {
  productsData: { data: TProduct[]; meta?: TMeta };
  businessTypeSlug: string;
  productCategories: TProductCategory[];
}

// Keep in sync with your actual fixed navbar's rendered height + a small gap.
const NAVBAR_OFFSET = 112;

export default function Products({
  productsData,
  businessTypeSlug,
  productCategories,
}: IProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState(productsData.data);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [highlightedCategoryId, setHighlightedCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string | null;
    action: "edit" | "delete" | null;
    product?: TProduct | null;
  }>({ id: null, action: null });

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
    { label: t("name_a_to_z"), value: "name" },
    { label: t("name_z_to_a"), value: "-name" },
    { label: t("price_high_to_low"), value: "-pricing.finalPrice" },
    { label: t("price_low_to_high"), value: "pricing.finalPrice" },
    { label: t("highest_rated"), value: "-rating.average" },
    { label: t("lowest_rated"), value: "rating.average" },
  ];

  const filterOptions = [
    {
      label: t("availability_status"),
      key: "status",
      placeholder: "Select a status",
      type: "select",
      items: [
        { label: t("in_stock"), value: t("in_stock") },
        { label: t("out_of_stock"), value: t("out_of_stock") },
        { label: t("limited"), value: t("limited") },
      ],
    },
  ];

  const groupedProducts = useMemo(() => {
    const groups: Record<
      string,
      { category: TProductCategory | null; products: TProduct[] }
    > = {};

    productCategories.forEach((cat) => {
      groups[cat._id] = { category: cat, products: [] };
    });

    products.forEach((product) => {
      const categoryId = product.category?._id;
      if (categoryId && groups[categoryId]) {
        groups[categoryId].products.push(product);
      } else {
        if (!groups["uncategorized"]) {
          groups["uncategorized"] = { category: null, products: [] };
        }
        groups["uncategorized"].products.push(product);
      }
    });

    return Object.values(groups).filter((group) => group.products.length > 0);
  }, [products, productCategories]);

  useEffect(() => {
    if (groupedProducts.length > 0 && !activeCategoryId) {
      setActiveCategoryId(groupedProducts[0].category?._id || "uncategorized");
    }
  }, [groupedProducts, activeCategoryId]);

  useEffect(() => {
    setProducts(productsData.data);
  }, [productsData]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    };
  }, []);

  const getCategoryName = (category: TProductCategory | null) => {
    if (!category) return t("uncategorized") || "Uncategorized";
    return category.name?.en || category.name?.pt || "Unnamed";
  };

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    const el = categoryRefs.current[id];
    if (!el) return;

    const targetY = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
    window.scrollTo({ top: targetY, behavior: "smooth" });

    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    setHighlightedCategoryId(id);
    highlightTimeoutRef.current = setTimeout(() => setHighlightedCategoryId(null), 1200);
  };

  const openDeleteDialog = (id: string) => setSelectedProduct({ id, action: "delete" });
  const onEditClick = (product: TProduct) =>
    setSelectedProduct({ id: product._id as string, action: "edit", product });

  const handleDeleteProduct = async () => {
    const toastId = toast.loading("Deleting product...");
    if (selectedProduct.id && selectedProduct.action === "delete") {
      const result = await deleteProductReq(selectedProduct.id);
      if (result.success) {
        setProducts((prev) =>
          prev.filter((product) => product.productId !== selectedProduct.id)
        );
        toast.success("Product deleted successfully", { id: toastId });
        setSelectedProduct({ id: null, action: null });
        return;
      }
      toast.error(result.message || "Product deletion failed", { id: toastId });
    }
  };

  // ---- Bulletproof sidebar pinning (independent of any ancestor CSS) ----
  const [mounted, setMounted] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [pinRect, setPinRect] = useState<{ left: number; width: number } | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null); // reserves layout space
  const sentinelRef = useRef<HTMLDivElement | null>(null); // 1px trip-wire at natural top

  useEffect(() => setMounted(true), []);

  // Measure where the sidebar should sit once pinned (left offset + width),
  // and keep it correct on resize.
  useLayoutEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      setPinRect({ left: rect.left, width: rect.width });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // IntersectionObserver trip-wire: fires only when the boundary is actually
  // crossed, not on every scroll frame — this is what eliminates the
  // "jumps to top then snaps back" flicker on fast scrolling.
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPinned(!entry.isIntersecting),
      { rootMargin: `-${NAVBAR_OFFSET}px 0px 0px 0px`, threshold: 0 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const sidebarInner = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        {t("product_categories") || "Product categories"}
      </h3>

      <div className="space-y-1">
        {groupedProducts.map((group) => {
          const id = group.category?._id || "uncategorized";
          const isActive = activeCategoryId === id;

          return (
            <button
              key={id}
              onClick={() => scrollToCategory(id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                ? "bg-[#DC3173]/10 text-[#DC3173]"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <span className="truncate uppercase tracking-wide">
                {getCategoryName(group.category)}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${isActive
                  ? "bg-[#DC3173]/15 text-[#DC3173]"
                  : "bg-gray-100 text-gray-500"
                  }`}
              >
                {group.products.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-linear-to-r from-[#DC3173] to-[#FF6CAB] p-6 rounded-lg mb-6 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {t("food_items")}
            </h1>
            <p className="text-pink-100 mt-1">
              {t("manage_your_restaurants_food_delivery_items")}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AllFilters
        sortOptions={sortOptions}
        {...(businessTypeSlug !== "restaurant" ? { filterOptions } : {})}
      />

      {groupedProducts.length > 0 ? (
        <div className="flex gap-6 mt-6 items-start">
          {/* LEFT SIDEBAR COLUMN – always reserves the layout space */}
          <div ref={wrapperRef} className="hidden lg:block w-64 shrink-0 self-start relative">
            {/* 1px trip-wire the IntersectionObserver watches */}
            <div ref={sentinelRef} className="absolute top-0 left-0 h-px w-full" />

            {isPinned ? (
              <>
                {/* Placeholder keeps the flex row from collapsing while the
                    real sidebar is portaled out to <body> as `fixed`. */}
                <div aria-hidden="true" style={{ height: 1 }} />
                {mounted &&
                  pinRect &&
                  createPortal(
                    <div
                      className="fixed z-20"
                      style={{ top: NAVBAR_OFFSET, left: pinRect.left, width: pinRect.width }}
                    >
                      {sidebarInner}
                    </div>,
                    document.body
                  )}
              </>
            ) : (
              sidebarInner
            )}
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 min-w-0 space-y-10">
            {groupedProducts.map((group) => {
              const id = group.category?._id || "uncategorized";
              const isHighlighted = highlightedCategoryId === id;

              return (
                <motion.div
                  key={id}
                  ref={(el) => {
                    categoryRefs.current[id] = el;
                  }}
                  id={`category-${id}`}
                  className="scroll-mt-32 rounded-xl"
                  animate={{
                    backgroundColor: isHighlighted
                      ? "rgba(220,49,115,0.06)"
                      : "rgba(220,49,115,0)",
                  }}
                  transition={{ duration: isHighlighted ? 0.3 : 0.9, ease: "easeOut" }}
                >
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                        {getCategoryName(group.category)}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {group.products.length}{" "}
                        {group.products.length === 1
                          ? t("item") || "item"
                          : t("items") || "items"}
                      </span>
                    </div>

                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      <AnimatePresence mode="popLayout">
                        {group.products.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            onDelete={openDeleteDialog}
                            onEdit={onEditClick}
                            t={t}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">{t("no_items_found")}</h3>
          <p className="text-gray-500 max-w-md">
            {t("no_items_match_current_filters")}
          </p>
        </motion.div>
      )}

      {/* Dialogs */}
      <DeleteProductDialog
        open={!!selectedProduct.id && selectedProduct.action === "delete"}
        onOpenChange={() => setSelectedProduct({ id: null, action: null, product: null })}
        onConfirm={handleDeleteProduct}
        t={t}
      />
      <EditProductDialog
        open={!!selectedProduct.id && selectedProduct.action === "edit"}
        onOpenChange={() => setSelectedProduct({ id: null, action: null, product: null })}
        prevData={selectedProduct?.product as TProduct}
        businessTypeSlug={businessTypeSlug}
      />
    </div>
  );
}