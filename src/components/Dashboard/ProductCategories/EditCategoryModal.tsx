// components/categories/EditCategoryModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCategoryValidation } from "@/src/validations/product-categories/product-categories.validation";
import { translateObject } from "@/src/utils/translation/translationObject";
import { useTranslation } from "@/src/hooks/use-translation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileTextIcon, ActivitySquareIcon, LoaderIcon, SaveIcon } from "lucide-react";
import z from "zod";
import { TProductCategory } from "@/src/types/category.type";
import { updateProductCategory } from "@/src/services/dashboard/categories/product-categories";

type FormData = z.infer<typeof productCategoryValidation>;

interface EditCategoryModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    category: TProductCategory;
}

export const EditCategoryModal = ({ isOpen, onOpenChange, category }: EditCategoryModalProps) => {
    const { t, lang } = useTranslation();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(productCategoryValidation),
        defaultValues: {
            name: { en: "", pt: "" },
            isActive: true,
            currentLang: lang,
        },
    });

    useEffect(() => {
        if (category) {
            form.reset({
                name: {
                    en: category?.name?.en || "",
                    pt: category?.name?.pt || "",
                },
                isActive: category?.isActive ?? true,
                currentLang: lang,
            });
        }
    }, [category, lang, form]);

    const onEditSubmit = async (data: FormData) => {
        if (!category?._id) return;

        const toastId = toast.loading("Updating category...");
        setIsSubmitting(true);

        const hasChanged = (before: unknown, after: unknown): boolean => {
            return JSON.stringify(before) !== JSON.stringify(after);
        };

        const before = category;
        const updatePayload: Record<string, unknown> = {};

        // ── Name Diffing & Conditional Translation ──
        const textToTranslate: Record<string, { en?: string; pt?: string }> = {};

        if (hasChanged(before?.name, data.name)) {
            textToTranslate.name = {
                en: data.name?.en || "",
                pt: data.name?.pt || "",
            };
        }

        // Only invoke translation API if name changed
        if (Object.keys(textToTranslate).length > 0) {
            const translated = await translateObject(textToTranslate, lang);

            if (!translated) {
                toast.error("Translation failed!", { id: toastId });
                setIsSubmitting(false);
                return;
            }

            if (translated.name) {
                updatePayload.name = translated.name;
            }
        }

        // ── isActive Diffing ──
        if (hasChanged(before?.isActive, data.isActive)) {
            updatePayload.isActive = data.isActive;
        }

        // ── Early Return if No Changes Detected ──
        if (Object.keys(updatePayload).length === 0) {
            toast.info("No changes detected", { id: toastId });
            setIsSubmitting(false);
            onOpenChange(false);
            return;
        }

        try {
            // ── Trigger API Update ──
            const result = await updateProductCategory(updatePayload, category._id);

            if (!result?.success) {
                if (result?.data?.errorSources) {
                    result.data.errorSources.forEach(
                        (err: { path: string; message: string }) => {
                            toast.error(err?.message, { id: toastId });
                        }
                    );
                } else {
                    toast.error(result?.message || "Failed to update category", { id: toastId });
                }
                setIsSubmitting(false);
                return;
            }

            toast.success(result?.message || "Category updated successfully!", { id: toastId });
            onOpenChange(false);
            router.refresh();
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border-none">
                <DialogHeader className="bg-linear-to-r from-[#DC3173] to-[#E95A9E] p-6 text-white">
                    <DialogTitle className="text-xl font-bold text-white">
                        {t("edit_product_category") || "Edit Product Category"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onEditSubmit)} className="p-6 space-y-6 bg-white">
                        <div className="space-y-4">
                            {lang === "en" ? (
                                <FormField
                                    control={form.control}
                                    name="name.en"
                                    render={({ field }) => (
                                        <FormItem className="content-start">
                                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                                <div className="flex items-center">
                                                    <FileTextIcon className="w-5 h-5 text-[#DC3173]" />
                                                    <span className="ml-2">{t("category_name")}</span>
                                                </div>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={t("category_placeholder")}
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="name.pt"
                                    render={({ field }) => (
                                        <FormItem className="content-start">
                                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                                <div className="flex items-center">
                                                    <FileTextIcon className="w-5 h-5 text-[#DC3173]" />
                                                    <span className="ml-2">{t("category_name")}</span>
                                                </div>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={t("category_placeholder")}
                                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div>
                                <div className="flex items-center mb-3 text-sm font-medium text-gray-700">
                                    <ActivitySquareIcon className="w-5 h-5 text-[#DC3173]" />
                                    <span className="ml-2">{t("active_status")}</span>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-sm font-medium">
                                                    {t("is_active")}
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#DC3173] hover:bg-[#DC3173]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DC3173] transition-all duration-200"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {isSubmitting ? (
                                    <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <>
                                        <SaveIcon className="w-5 h-5 mr-2" />
                                        {t("update_category") || "Update Category"}
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};