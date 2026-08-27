"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { PackageIcon, Loader2Icon } from "lucide-react";

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateItemSortOrder } from "@/src/services/dashboard/menu/menu.service";
import { IProductItem } from "@/src/types/menu.type";

const updateSortOrderSchema = z.object({
    sortOrder: z.number().min(0, "Sort order must be at least 0"),
});

export type UpdateSortOrderSchema = z.infer<typeof updateSortOrderSchema>;

interface IProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: IProductItem;
    sectionId: string;
}

export default function UpdateItemSortOrder({
    open,
    onOpenChange,
    item,
    sectionId
}: IProps) {
    const { t, lang } = useTranslation();
    const currentLang = (lang as "en" | "pt") || "en";
    const [isSubmitting, setIsSubmitting] = useState(false);

    const product = item?.productId;
    const itemName = product?.name?.[currentLang] || product?.name?.en || "Product";
    const itemPrice = product?.pricing?.price;
    const currency = product?.pricing?.currency || "€";
    const itemImage = product?.images?.[0];

    const form = useForm<UpdateSortOrderSchema>({
        resolver: zodResolver(updateSortOrderSchema),
        defaultValues: {
            sortOrder: item?.sortOrder ?? 0,
        },
    });

    useEffect(() => {
        if (item) {
            form.reset({
                sortOrder: item.sortOrder ?? 0,
            });
        }
    }, [item, form]);

    const onSubmit = async (values: UpdateSortOrderSchema) => {
        if (!item?.productId?._id) return;

        const toastId = toast.loading("Updating sort order...");
        setIsSubmitting(true);

        const payload = {
            sortOrder: values.sortOrder,
        };

        const result = await updateItemSortOrder(payload, sectionId, item?.productId?._id);

        if (result?.success) {
            toast.success(result?.message || "Sort order updated successfully!", { id: toastId });
            onOpenChange(false);
            setIsSubmitting(false);
            return;
        }

        toast.error(result?.message || "Failed to update sort order", {
            id: toastId,
        });
        setIsSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md flex flex-col p-6 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        {t("update_sort_order") || "Update Sort Order"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                        {t("update_sort_order_desc") || "Adjust the display position for this item in the menu section."}
                    </DialogDescription>
                </DialogHeader>

                {/* ── Item Preview Header ── */}
                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 my-2">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-200 shrink-0">
                        {itemImage ? (
                            <Image
                                src={itemImage}
                                alt={itemName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <PackageIcon className="w-6 h-6 text-slate-400 m-auto" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {itemName}
                        </p>
                        {itemPrice !== undefined && (
                            <p className="text-xs text-[#DC3173] font-bold">
                                {currency}{itemPrice}
                            </p>
                        )}
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* ── Sort Order Input ── */}
                        <FormField
                            control={form.control}
                            name="sortOrder"
                            render={({ field }) => (
                                <FormItem className="gap-1">
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        {t("sort_order") || "Sort Order"}
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
                                disabled={isSubmitting}
                                className="h-9 text-xs bg-[#DC3173] hover:bg-[#DC3173]/90 text-white"
                            >
                                {isSubmitting && <Loader2Icon className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                                {t("update") || "Update"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}