"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDownIcon,
    PackageIcon,
    CheckCircle2Icon,
    XCircleIcon,
    Edit2Icon,
    Trash2Icon,
    PlusIcon,
} from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";
import { IMenuSection, IProductItem } from "@/src/types/menu.type";
import EditMenuSection from "./EditMenuSection";
import DeleteModal from "@/src/components/Modals/DeleteModal";
import { deleteMenuSection, removeSectionItem } from "@/src/services/dashboard/menu/menu.service";
import { toast } from "sonner";
import { TProduct } from "@/src/types/product.type";
import AddItemToSection from "./AddItemToSection";
import UpdateItemSortOrder from "./UpdateItemSortOrder";

interface IProps {
    menuId: string;
    sections: IMenuSection[];
    products: TProduct[];
}

export default function MenuSectionsList({
    menuId,
    sections,
    products,
}: IProps) {
    const { t, lang } = useTranslation();
    const currentLang = (lang as "en" | "pt") || "en";

    // ── Accordion State ──
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        [sections?.[0]?._id]: true,
    });

    const toggleSection = (id: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const [selectedSectionId, setSelectedSectionId] = useState("");
    // ── Edit Section State ──
    const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
    const [selectedSectionToEdit, setSelectedSectionToEdit] = useState<IMenuSection | null>(null);
    const [selectedItemToEdit, setSelectedItemToEdit] = useState<{
        sectionId: string;
        product: IProductItem;
    } | null>(null);

    // ── Delete Section State ──
    const [isDeleteSectionOpen, setIsDeleteSectionOpen] = useState(false);
    const [selectedSectionToDeleteId, setSelectedSectionToDeleteId] = useState<string | null>(null);

    // ── Delete Item State ──
    const [isRemoveItemOpen, setIsRemoveItemOpen] = useState(false);
    const [selectedItemToRemove, setSelectedItemToRemove] = useState<{
        sectionId: string;
        productId: string;
    } | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    // ── Section Actions ──
    const handleEditSection = (e: React.MouseEvent, section: IMenuSection) => {
        e.stopPropagation();
        setSelectedSectionToEdit(section);
        setIsEditSectionOpen(true);
    };
    const handleDeleteSectionTrigger = (e: React.MouseEvent, sectionId: string) => {
        e.stopPropagation();
        setSelectedSectionToDeleteId(sectionId);
        setIsDeleteSectionOpen(true);
    };
    const handleConfirmDeleteSection = async () => {
        if (!selectedSectionToDeleteId) return;
        const toastId = toast.loading("Deleting section...");
        setIsDeleting(true);

        try {
            const res = await deleteMenuSection(selectedSectionToDeleteId);
            if (res?.success) {
                toast.success(res?.message || "Section deleted successfully!", { id: toastId });
            } else {
                toast.error(res?.message || "Section deletion failed!", { id: toastId });
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteSectionOpen(false);
            setSelectedSectionToDeleteId(null);
        }
    };

    // ── Item Actions ──
    const handleUpdateItemSortOrder = (sectionId: string, product: IProductItem) => {
        setSelectedItemToEdit({ sectionId, product });
    };

    const handleRemoveItemTrigger = (sectionId: string, productId: string) => {
        setSelectedItemToRemove({ sectionId, productId });
        setIsRemoveItemOpen(true);
    };
    const handleConfirmRemoveItem = async () => {
        if (!selectedItemToRemove) return;
        const toastId = toast.loading("Removing item...");
        setIsDeleting(true);

        try {
            const res = await removeSectionItem(selectedItemToRemove.sectionId, selectedItemToRemove.productId);

            if (res?.success) {
                toast.success(res?.message || "Item deleted successfully!", { id: toastId });
            } else {
                toast.error(res?.message || "Item deletion failed!", { id: toastId });
            }
        } finally {
            setIsDeleting(false);
            setIsRemoveItemOpen(false);
            setSelectedItemToRemove(null);
        }
    };

    if (!sections || sections.length === 0) {
        return (
            <div className="bg-white shadow-md rounded-2xl p-8 border border-slate-100 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                    #
                </div>
                <h4 className="text-lg font-semibold text-slate-700">
                    {t("no_sections_found") || "No Sections Added Yet"}
                </h4>
                <p className="text-sm text-slate-400 mt-1">
                    {t("add_sections_to_organize") || "Add sections to group products inside this menu."}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#DC3173]/10 text-[#DC3173] text-xs font-bold flex items-center justify-center">
                            #
                        </span>
                        {t("menu_sections") || "Menu Sections"}
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-[#DC3173]/10 text-[#DC3173] rounded-full">
                        {sections.length} {sections.length === 1 ? t("section") || "Section" : t("sections") || "Sections"}
                    </span>
                </div>

                {/* Sections List */}
                <div className="space-y-3">
                    {sections.map((section) => {
                        const isOpen = !!expandedSections[section._id];
                        const itemCount = section.items?.length || 0;

                        return (
                            <div
                                key={section._id}
                                className="bg-white shadow-md rounded-2xl border border-slate-100 overflow-hidden transition-all"
                            >
                                {/* Accordion Header */}
                                <div
                                    onClick={() => toggleSection(section._id)}
                                    className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-[#DC3173]/10 text-[#DC3173] font-extrabold text-sm rounded-xl flex items-center justify-center shrink-0">
                                            {section.sortOrder + 1}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-800 text-base">
                                                    {section.name?.[currentLang] || section.name?.en}
                                                </h4>
                                                {section.isActive ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                                                        <CheckCircle2Icon className="w-3 h-3" />
                                                        {t("active") || "Active"}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800">
                                                        <XCircleIcon className="w-3 h-3" />
                                                        {t("inactive") || "Inactive"}
                                                    </span>
                                                )}
                                            </div>
                                            {section.description?.[currentLang] && (
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                                    {section.description[currentLang]}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg flex items-center gap-1">
                                                <PackageIcon className="w-3.5 h-3.5 text-[#DC3173]" />
                                                {itemCount} {itemCount === 1 ? t('item') : t("items")}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={(e) => handleEditSection(e, section)}
                                                className="p-1.5 text-slate-600 hover:text-[#DC3173] hover:bg-white rounded-md transition-colors"
                                                title={t("edit_section") || "Edit Section"}
                                            >
                                                <Edit2Icon className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => handleDeleteSectionTrigger(e, section._id)}
                                                className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-white rounded-md transition-colors"
                                                title={t("delete_section") || "Delete Section"}
                                            >
                                                <Trash2Icon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Accordion Body */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="border-t border-slate-100 bg-slate-50/50 p-4 md:p-5"
                                        >
                                            <div className="flex justify-end mb-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSectionId(section._id)}
                                                    className="text-xs font-semibold text-[#DC3173] hover:text-[#DC3173]/80 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#DC3173]/30 transition-all shadow-sm"
                                                >
                                                    <PlusIcon className="w-3.5 h-3.5" />
                                                    {t("add_product") || "Add Product"}
                                                </button>
                                            </div>

                                            {itemCount === 0 ? (
                                                <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl bg-white">
                                                    {t("no_products_in_section") || "No products inside this section."}
                                                </p>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {section.items.map((item: IProductItem, index: number) => {
                                                        const prod = item.productId;
                                                        if (!prod) return null;

                                                        return (
                                                            <div
                                                                key={prod._id || index}
                                                                className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                                        {prod.images?.[0] ? (
                                                                            <Image
                                                                                src={prod.images[0]}
                                                                                alt={prod.name?.[currentLang] || "Product"}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        ) : (
                                                                            <PackageIcon className="w-6 h-6 text-slate-300 m-auto" />
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <h5 className="font-semibold text-sm text-slate-800 line-clamp-1">
                                                                            {prod.name?.[currentLang] || prod.name?.en}
                                                                        </h5>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <span className="text-xs font-bold text-[#DC3173]">
                                                                                {prod.pricing?.currency || "€"}
                                                                                {prod.pricing?.finalPrice ?? prod.pricing?.price}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <span
                                                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${item.isAvailable
                                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                                                            }`}
                                                                    >
                                                                        {item.isAvailable
                                                                            ? t("available") || "Available"
                                                                            : t("unavailable") || "Unavailable"}
                                                                    </span>

                                                                    <div className="flex items-center gap-1 border-l border-slate-100 pl-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleUpdateItemSortOrder(section._id, item)}
                                                                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors"
                                                                            title={t("edit_item") || "Edit Item"}
                                                                        >
                                                                            <Edit2Icon className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveItemTrigger(section._id, prod._id)}
                                                                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors"
                                                                            title={t("remove_item") || "Remove Item"}
                                                                        >
                                                                            <Trash2Icon className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div >

            {/* add item section */}
            < AddItemToSection
                sectionId={selectedSectionId}
                open={!!selectedSectionId
                }
                onOpenChange={() => setSelectedSectionId("")}
                products={products}
            />

            <UpdateItemSortOrder
                open={!!selectedItemToEdit}
                onOpenChange={(open) => {
                    if (!open) setSelectedItemToEdit(null);
                }}
                sectionId={selectedItemToEdit?.sectionId as string}
                item={selectedItemToEdit?.product as IProductItem}
            />

            {/* ──  Edit Menu Section ── */}
            {
                selectedSectionToEdit && (
                    <EditMenuSection
                        open={isEditSectionOpen}
                        onOpenChange={(open) => {
                            setIsEditSectionOpen(open);
                            if (!open) setSelectedSectionToEdit(null);
                        }}
                        menuId={menuId}
                        section={selectedSectionToEdit}
                    />
                )
            }

            {/* ── Delete Menu Section ── */}
            <DeleteModal
                open={isDeleteSectionOpen}
                onOpenChange={(open) => {
                    setIsDeleteSectionOpen(open);
                    if (!open) setSelectedSectionToDeleteId(null);
                }}
                onConfirm={handleConfirmDeleteSection}
                isDeleting={isDeleting}
            />

            {/* ── Remove Product Item from Section ── */}
            <DeleteModal
                open={isRemoveItemOpen}
                onOpenChange={(open) => {
                    setIsRemoveItemOpen(open);
                    if (!open) setSelectedItemToRemove(null);
                }}
                onConfirm={handleConfirmRemoveItem}
                isDeleting={isDeleting}
            />
        </>
    );
}