// AllProductCategories.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TProductCategory, TProductCategoryResponse } from "@/src/types/category.type";
import { motion } from "framer-motion";
import { Apple, CupSoda, Flame, Sandwich, Slice, Utensils, EyeIcon, Edit3Icon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditCategoryModal } from "./EditCategoryModal";
import { softDeleteProductCategory, updateProductCategory } from "@/src/services/dashboard/categories/product-categories";
import DeleteModal from "../../Modals/DeleteModal";

interface IProps {
    categoriesResult: TProductCategoryResponse;
}

const icons = {
    0: { icon: <Utensils />, color: "#FFE1E9" },
    1: { icon: <Apple />, color: "#FFF4D5" },
    2: { icon: <Sandwich />, color: "#E3F3FF" },
    3: { icon: <Flame />, color: "#FDEFE2" },
    4: { icon: <CupSoda />, color: "#E8FFE8" },
    5: { icon: <Slice />, color: "#FFF2E9" },
};

const AllProductCategories = ({ categoriesResult }: IProps) => {
    const { t, lang } = useTranslation();
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState<TProductCategory | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Delete modal states
    const [targetCategoryId, setTargetCategoryId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const sortOptions = [
        { label: t("newest_first"), value: "-createdAt" },
        { label: t("oldest_first"), value: "createdAt" },
        { label: t("name_a_to_z"), value: "name" },
        { label: t("name_z_to_a"), value: "-name" },
    ];

    const handleOpenEdit = (cat: TProductCategory) => {
        setSelectedCategory(cat);
        setIsEditOpen(true);
    };

    // Open modal triggers
    const triggerDelete = (id: string) => setTargetCategoryId(id);

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

            {/* FILTERS */}
            <AllFilters sortOptions={sortOptions} />

            {/* CATEGORY LIST */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 mt-4"
            >
                {categoriesResult?.data?.map((cat, i) => (
                    <Card
                        key={cat._id}
                        className="p-5 rounded-3xl border bg-white"
                        style={{
                            boxShadow: "0px 4px 20px rgba(0,0,0,0.06)",
                        }}
                    >
                        {/* The name takes what's left (at least 12rem); below that
                            the actions wrap under it instead of past the edge. */}
                        <CardContent className="p-0 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex min-w-0 flex-1 basis-48 items-center gap-4">
                                <div
                                    className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: icons[(i % 6) as keyof typeof icons]?.color,
                                        boxShadow: "inset 0px 0px 6px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    {icons[(i % 6) as keyof typeof icons]?.icon}
                                </div>

                                <div className="min-w-0">
                                    <div className="text-xl font-semibold wrap-anywhere">{cat?.name?.[lang]}</div>
                                    <div
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cat?.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {cat?.isActive ? t("active") : t("inactive")}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT ACTION CONTROLS */}
                            <div className="ml-auto flex shrink-0 items-center gap-3">
                                {/* View Action */}
                                <button
                                    onClick={() => router.push(`/vendor/product-categories/${cat._id}`)}
                                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#DC3173] hover:border-[#DC3173]/30 hover:bg-[#DC3173]/5 transition-all"
                                    title={t("view_category")}
                                >
                                    <EyeIcon className="w-4 h-4" />
                                </button>

                                {/* Edit Action */}
                                <button
                                    onClick={() => handleOpenEdit(cat)}
                                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#DC3173] hover:border-[#DC3173]/30 hover:bg-[#DC3173]/5 transition-all"
                                    title={t("edit_category")}
                                >
                                    <Edit3Icon className="w-4 h-4" />
                                </button>

                                {/* To the vendor this is just "delete"; the call is a
                                    soft delete, so only an admin can restore or
                                    permanently delete it. */}
                                <button
                                    onClick={() => triggerDelete(cat._id)}
                                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                                    title={t("delete")}
                                    aria-label={t("delete")}
                                >
                                    <Trash2Icon className="w-4 h-4" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* NO RESULTS */}
            {categoriesResult?.data?.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    {t("no_categories_found")}
                </div>
            )}

            {/* PAGINATION */}
            {!!categoriesResult?.meta?.totalPage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 md:px-6"
                >
                    <PaginationComponent
                        totalPages={categoriesResult?.meta?.totalPage as number}
                    />
                </motion.div>
            )}

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