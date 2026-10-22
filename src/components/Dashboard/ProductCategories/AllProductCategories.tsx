// AllProductCategories.tsx
"use client";

import React, { useState } from "react";
import AllFilters from "@/src/components/Filtering/AllFilters";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TProductCategory, TProductCategoryResponse } from "@/src/types/category.type";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditCategoryModal } from "./EditCategoryModal";
import SortableCategoryList from "./SortableCategoryList";
import { softDeleteProductCategory, updateProductCategory } from "@/src/services/dashboard/categories/product-categories";
import DeleteModal from "../../Modals/DeleteModal";

interface IProps {
    categoriesResult: TProductCategoryResponse;
    searchTerm: string;
}

const AllProductCategories = ({ categoriesResult, searchTerm }: IProps) => {
    const { t } = useTranslation();
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState<TProductCategory | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Delete modal states
    const [targetCategoryId, setTargetCategoryId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleOpenEdit = (cat: TProductCategory) => {
        setSelectedCategory(cat);
        setIsEditOpen(true);
    };

    // Unified confirm action executed by DeleteModal
    const handleConfirmDelete = async () => {
        if (!targetCategoryId) return;

        setIsDeleting(true);
        const toastId = toast.loading("Deleting category...");

        try {
            // The API refuses to soft delete an active category ("Please deactivate
            // it first", 409), so Soft delete switches it off first. Without this
            // the first click on an active category failed outright.
            const target = categoriesResult?.data?.find((cat) => cat._id === targetCategoryId);
            if (target?.isActive) {
                const off = await updateProductCategory({ isActive: false }, targetCategoryId);
                if (!off?.success) {
                    toast.error(off?.message || "Failed to delete", { id: toastId });
                    return;
                }
            }

            const res = await softDeleteProductCategory(targetCategoryId);

            if (res?.success) {
                toast.success(res?.message || "Category deleted", { id: toastId });
                setTargetCategoryId(null);
                router.refresh();
            } else {
                toast.error(res?.message || "Failed to delete", { id: toastId });
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen space-y-8">
            {/* HEADER */}
            <TitleHeader
                title={t("product_categories")}
                subtitle={t("these_are_platform_managed_categories")}
            />

            {/* FILTERS: search only. No sort, as the API always lists categories
                in the vendor's own order now and ignores `sortBy`. */}
            <AllFilters sortOptions={[]} />

            {/* CATEGORY LIST: every category, dragged into order in place. */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <SortableCategoryList
                    categories={categoriesResult?.data ?? []}
                    searchTerm={searchTerm}
                    onView={(cat) => router.push(`/vendor/product-categories/${cat._id}`)}
                    onEdit={handleOpenEdit}
                    onDelete={(cat) => setTargetCategoryId(cat._id)}
                />
            </motion.div>

            {/* EDIT MODAL */}
            <EditCategoryModal
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                category={selectedCategory as TProductCategory}
            />

            {/* DELETE CONFIRMATION */}
            <DeleteModal
                open={!!targetCategoryId}
                onOpenChange={(open) => {
                    if (!open) setTargetCategoryId(null);
                }}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                title={t("delete_category_title")}
                description={t("delete_category_description")}
                confirmLabel={t("delete")}
            />
        </div>
    );
};

export default AllProductCategories;
