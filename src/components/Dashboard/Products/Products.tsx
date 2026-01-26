"use client";

import DeleteProductDialog from "@/src/components/Dashboard/Products/DeleteProductDialog";
import EditProductDialog from "@/src/components/Dashboard/Products/EditProductDialog";
import ProductCard from "@/src/components/Dashboard/Products/ProductCard";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import { useTranslation } from "@/src/hooks/use-translation";
import { deleteProductReq } from "@/src/services/dashboard/products/products";
import { TMeta } from "@/src/types";
import { TProduct } from "@/src/types/product.type";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Products({
  initialData,
}: {
  initialData: { data: TProduct[]; meta?: TMeta };
}) {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string | null;
    action: "edit" | "delete" | null;
    product?: TProduct | null;
  }>({ id: null, action: null });

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
        {
          label: t("in_stock"),
          value: t("in_stock"),
        },
        {
          label: t("out_of_stock"),
          value: t("out_of_stock"),
        },
        {
          label: t("limited"),
          value: t("limited"),
        },
      ],
    },
  ];

  const openDeleteDialog = (id: string) => {
    setSelectedProduct({ id, action: "delete" });
  };

  const onEditClick = (product: TProduct) => {
    setSelectedProduct({ id: product._id as string, action: "edit", product });
  };

  const handleDeleteProduct = async () => {
    const toastId = toast.loading("Deleting product...");
    if (selectedProduct.id && selectedProduct.action === "delete") {
      const result = await deleteProductReq(selectedProduct.id);

      if (result.success) {
        toast.success("Product deleted successfully", { id: toastId });
        // await getProducts(queryParams);
        setSelectedProduct({ id: null, action: null });
        return;
      }

      toast.error(result.message || "Product deletion failed", { id: toastId });
      console.log(result);
    }
  };

  return (
    <div className="w-full p-4 md:p-6">
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
      <AllFilters sortOptions={sortOptions} filterOptions={filterOptions} />

      {initialData.data?.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            {t("showing")}{" "}
            {((initialData.meta?.page || 1) - 1) *
              (initialData.meta?.limit || 10) +
              1}
            -{" "}
            {Math.min(
              (initialData.meta?.page || 1) * (initialData.meta?.limit || 10),
              initialData.meta?.total || 0,
            )}{" "}
            {t("of")} {initialData.meta?.total || 0} {t("items")}
          </p>
        </div>
      )}

      {initialData?.data?.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {initialData?.data?.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onDelete={openDeleteDialog}
                onEdit={onEditClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="flex flex-col items-center justify-center py-12 text-center"
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

      {!!initialData?.meta?.total && initialData?.meta?.total > 0 && (
        <div className="pb-4 my-3">
          <PaginationComponent totalPages={initialData?.meta?.totalPage || 0} />
        </div>
      )}

      <DeleteProductDialog
        open={!!selectedProduct.id && selectedProduct.action === "delete"}
        onOpenChange={() =>
          setSelectedProduct({ id: null, action: null, product: null })
        }
        onConfirm={handleDeleteProduct}
      />

      <EditProductDialog
        open={!!selectedProduct.id && selectedProduct.action === "edit"}
        onOpenChange={() =>
          setSelectedProduct({ id: null, action: null, product: null })
        }
        prevData={selectedProduct?.product as TProduct}
      />
    </div>
  );
}
