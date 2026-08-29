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
import { permanentDeleteProductCategory, softDeleteProductCategory } from "@/src/services/dashboard/categories/product-categories";
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
    const [deleteType, setDeleteType] = useState<"soft" | "permanent" | null>(null);
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
    const triggerSoftDelete = (id: string) => {
        setTargetCategoryId(id);
        setDeleteType("soft");
    };

    const triggerPermanentDelete = (id: string) => {
        setTargetCategoryId(id);
        setDeleteType("permanent");
    };

    // Unified confirm action executed by DeleteModal
    const handleConfirmDelete = async () => {
        if (!targetCategoryId || !deleteType) return;

        setIsDeleting(true);
        const isPermanent = deleteType === "permanent";
        const toastId = toast.loading(
            isPermanent ? "Deleting permanently..." : "Archiving category..."
        );

        try {
            const res = isPermanent
                ? await permanentDeleteProductCategory(targetCategoryId)
                : await softDeleteProductCategory(targetCategoryId);

            if (res?.success) {
                toast.success(
                    res?.message || (isPermanent ? "Category deleted permanently" : "Category moved to trash"),
                    { id: toastId }
                );
                setTargetCategoryId(null);
                setDeleteType(null);
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
                        <CardContent className="p-0 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: icons[(i % 6) as keyof typeof icons]?.color,
                                        boxShadow: "inset 0px 0px 6px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    {icons[(i % 6) as keyof typeof icons]?.icon}
                                </div>

                                <div>
                                    <div className="text-xl font-semibold">{cat?.name?.[lang]}</div>
                                    <div
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cat?.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {cat?.isActive ? t("active") : t("inactive")}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT ACTION CONTROLS */}
                            <div className="flex items-center gap-3">
                                {/* View Action */}
                                <button
                                    onClick={() => router.push(`/vendor/product-categories/${cat._id}`)}
                                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#DC3173] hover:border-[#DC3173]/30 hover:bg-[#DC3173]/5 transition-all"
                                    title="View Category"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                </button>

                                {/* Edit Action */}
                                <button
                                    onClick={() => handleOpenEdit(cat)}
                                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#DC3173] hover:border-[#DC3173]/30 hover:bg-[#DC3173]/5 transition-all"
                                    title="Edit Category"
                                >
                                    <Edit3Icon className="w-4 h-4" />
                                </button>

                                {/* Delete Action */}
                                {cat?.isDeleted ? (
                                    <button
                                        onClick={() => triggerPermanentDelete(cat._id)}
                                        className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                                        title="Permanent Delete"
                                    >
                                        <Trash2Icon className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => triggerSoftDelete(cat._id)}
                                        className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all"
                                        title="Soft Delete (Archive)"
                                    >
                                        <Trash2Icon className="w-4 h-4" />
                                    </button>
                                )}
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

            {/* UNIFIED DELETE MODAL */}
            <DeleteModal
                open={!!targetCategoryId}
                onOpenChange={(open) => {
                    if (!open) {
                        setTargetCategoryId(null);
                        setDeleteType(null);
                    }
                }}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default AllProductCategories;