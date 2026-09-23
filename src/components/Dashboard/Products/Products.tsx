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
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import TitleHeader from "../../TitleHeader/TitleHeader";

interface IProps {
  productsData: { data: TProduct[]; meta?: TMeta };
  businessTypeSlug: string;
  productCategories: TProductCategory[];
}

export default function Products({
  productsData,
  businessTypeSlug,
  productCategories,
}: IProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState(productsData.data);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string | null;
    action: "edit" | "delete" | null;
    product?: TProduct | null;
  }>({ id: null, action: null });

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  const getCategoryName = (category: TProductCategory | null) => {
    if (!category) return t("uncategorized") || "Uncategorized";
    return category.name?.en || category.name?.pt || "Unnamed";
  };

  const openDeleteDialog = (id: string) =>
    setSelectedProduct({ id, action: "delete" });

  const onEditClick = (product: TProduct) =>
    setSelectedProduct({
      id: product._id as string,
      action: "edit",
      product,
    });

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

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    const target = sectionRefs.current[id];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full flex flex-col h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] overflow-hidden">
      {/* Header – fixed height */}
      <TitleHeader
        title={t("food_items")}
        subtitle={t("manage_your_restaurants_food_delivery_items")}
      />

      {/* Filters – fixed height */}
      <div className="shrink-0 mb-4">
        <AllFilters
          sortOptions={sortOptions}
          {...(businessTypeSlug !== "restaurant" ? { filterOptions } : {})}
        />
      </div>

      {/* Main content area – takes remaining height */}
      {groupedProducts.length > 0 ? (
        <div className="flex flex-1 min-h-0 gap-6 overflow-hidden">
          {/* LEFT SIDEBAR – fixed, scrolls independently if needed */}
          <div className="hidden lg:block w-64 shrink-0 h-full overflow-y-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-0">
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
                      onClick={() => {
                        setActiveCategoryId(id);
                        scrollToCategory(id)
                      }}
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
          </div>

          {/* RIGHT CONTENT – scrolls */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto space-y-10 pr-1">
            <div
              ref={scrollContainerRef}
              className="flex-1 min-w-0 h-full overflow-y-auto space-y-10 pr-1 no-scrollbar"
            >
              {groupedProducts.map((group) => {
                const id = group.category?._id || "uncategorized";

                return (
                  <div
                    key={id}
                    id={`category-${id}`}
                    ref={(el) => {
                      sectionRefs.current[id] = el;
                    }}
                    className="rounded-xl"
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

                      <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                      >
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
                  </div>
                );
              })}
            </div>
            {/* {groupedProducts.map((group) => {
              const id = group.category?._id || "uncategorized";

              return (
                <div key={id} id={`category-${id}`} className="rounded-xl">
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

                    <motion.div
                      layout
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    >
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
                </div>
              );
            })} */}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">{t("no_items_found")}</h3>
          <p className="text-gray-500 max-w-md">
            {t("no_items_match_current_filters")}
          </p>
        </div>
      )}

      {/* Dialogs */}
      <DeleteProductDialog
        open={!!selectedProduct.id && selectedProduct.action === "delete"}
        onOpenChange={() =>
          setSelectedProduct({ id: null, action: null, product: null })
        }
        onConfirm={handleDeleteProduct}
        t={t}
      />
      <EditProductDialog
        open={!!selectedProduct.id && selectedProduct.action === "edit"}
        onOpenChange={() =>
          setSelectedProduct({ id: null, action: null, product: null })
        }
        prevData={selectedProduct?.product as TProduct}
        businessTypeSlug={businessTypeSlug}
      />
    </div>
  );
}