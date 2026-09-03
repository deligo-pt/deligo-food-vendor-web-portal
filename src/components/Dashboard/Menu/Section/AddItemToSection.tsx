"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { PackageIcon, Loader2Icon, SearchIcon, CheckIcon } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/src/components/ui/dialog";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useTranslation } from "@/src/hooks/use-translation";
import { TProduct } from "@/src/types/product.type";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { addItemToSection } from "@/src/services/dashboard/menu/menu.service";
import { itemAddSchema } from "@/src/validations/menu/section.validation";

export type AddItemToSectionSchema = z.infer<typeof itemAddSchema>;

interface IProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    products: TProduct[];
    sectionId: string;
}

export default function AddItemToSection({
    open,
    onOpenChange,
    products = [],
    sectionId,
}: IProps) {
    const { t, lang } = useTranslation();
    const currentLang = (lang as "en" | "pt") || "en";
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AddItemToSectionSchema>({
        resolver: zodResolver(itemAddSchema),
        defaultValues: {
            productId: "",
            sortOrder: 0,
            isAvailable: true,
        },
    });

    const selectedProductId = form.watch("productId");

    const filteredProducts = products.filter((prod) => {
        const name = prod.name?.[currentLang] || prod.name?.en || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const onSubmit = async (values: AddItemToSectionSchema) => {
        const toastId = toast.loading("Adding product to section...");
        setIsSubmitting(true);

        const payload = {
            productId: values.productId,
            sortOrder: values.sortOrder ?? 0,
            isAvailable: values.isAvailable ?? true,
        };

        const result = await addItemToSection(payload, sectionId);

        if (result?.success) {
            toast.success(result?.message || "Product added successfully!", { id: toastId });
            form.reset();
            onOpenChange(false);
            setIsSubmitting(false);
            return;
        };

        toast.error(result?.message || "Product add failed", {
            id: toastId,
        });
        setIsSubmitting(false);

    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-6 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        {t("add_product_to_section") || "Add Product to Section"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                        {t("select_product_desc") || "Select a product from your catalog to include in this menu section."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex-1 overflow-y-auto pr-1">
                        {/* ── Product Picker Section ── */}
                        <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-sm font-medium text-slate-700">
                                        {t("select_product") || "Select Product"}
                                    </FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            {/* Search Input */}
                                            <div className="relative">
                                                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    placeholder={t("search_products") || "Search products..."}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-9 h-9 text-xs"
                                                />
                                            </div>

                                            {/* Selectable Products Scroll List */}
                                            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-100 bg-slate-50/50 p-1">
                                                {filteredProducts.length === 0 ? (
                                                    <div className="p-4 text-center text-xs text-slate-400">
                                                        {t("no_products_found") || "No products found."}
                                                    </div>
                                                ) : (
                                                    filteredProducts.map((prod) => {
                                                        const isSelected = field.value === prod._id;
                                                        const name = prod.name?.[currentLang] || prod.name?.en;

                                                        return (
                                                            <div
                                                                key={prod._id}
                                                                onClick={() => field.onChange(prod._id)}
                                                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${isSelected
                                                                    ? "bg-[#DC3173]/10 border border-[#DC3173]/30"
                                                                    : "hover:bg-white"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="relative w-8 h-8 rounded-md overflow-hidden bg-slate-200 shrink-0">
                                                                        {prod.images?.[0] ? (
                                                                            <Image
                                                                                src={prod.images[0]}
                                                                                alt={name || "Product"}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        ) : (
                                                                            <PackageIcon className="w-4 h-4 text-slate-400 m-auto" />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                                                                            {name}
                                                                        </p>
                                                                        <p className="text-[10px] text-[#DC3173] font-bold">
                                                                            {prod.pricing?.currency || "€"}
                                                                            {prod.pricing?.price}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="w-5 h-5 rounded-full bg-[#DC3173] text-white flex items-center justify-center">
                                                                        <CheckIcon className="w-3 h-3" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ── Sort Order + Availability Controls ── */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <FormField
                                control={form.control}
                                name="sortOrder"
                                render={({ field }) => (
                                    <FormItem className="gap-1">
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            {t("sort_order") || "Sort order"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === "" ? 0 : Number(e.target.value)
                                                    )
                                                }
                                                value={field.value ?? 0}
                                                className="h-10 focus:border-[#DC3173] focus:ring-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isAvailable"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-auto h-10">
                                        <FormLabel className="text-xs font-medium text-gray-700">
                                            {t("is_available") || "Available"}
                                        </FormLabel>
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

                        {/* Submit Controls */}
                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                                className="h-9 text-xs"
                            >
                                {t("cancel") || "Cancel"}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !selectedProductId}
                                className="h-9 text-xs bg-[#DC3173] hover:bg-[#DC3173]/90 text-white"
                            >
                                {isSubmitting && <Loader2Icon className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                                {t("add_product") || "Add Product"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}