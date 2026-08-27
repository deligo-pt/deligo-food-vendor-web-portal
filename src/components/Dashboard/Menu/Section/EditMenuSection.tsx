'use client';

import { Form } from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "@/src/hooks/use-translation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { translateObject } from "@/src/utils/translation/translationObject";
import { toast } from "sonner";
import { createMenuSectionSchema } from "@/src/validations/menu/section.validation";
import MenuSectionForm from "./SectionForm";
import { updateMenuSection, updateSectionSortOrder } from "@/src/services/dashboard/menu/menu.service";
import { IMenuSection } from "@/src/types/menu.type";

export type CreateMenuSectionFormValues = z.infer<
    ReturnType<typeof createMenuSectionSchema>
>;

interface IProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    menuId: string;
    section: IMenuSection;
}

const EditMenuSection = ({ menuId, open, onOpenChange, section }: IProps) => {
    const { t, lang } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CreateMenuSectionFormValues>({
        resolver: zodResolver(createMenuSectionSchema(lang)),
        defaultValues: {
            name: section?.name,
            description: section?.description,
            sortOrder: section?.sortOrder || 0,
            isActive: section?.isActive || true,
        },
    });

    const onSubmit = async (values: CreateMenuSectionFormValues) => {
        const toastId = toast.loading("Updating section...");
        setIsSubmitting(true);

        const hasChanged = (before: unknown, after: unknown): boolean => {
            return JSON.stringify(before) !== JSON.stringify(after);
        };

        const before = section;
        const mainPayload: Record<string, unknown> = {};

        let isSortOrderChanged = false;
        let newSortOrder = 0;

        // ── Check sortOrder Change ──
        if (hasChanged(before?.sortOrder, values.sortOrder)) {
            isSortOrderChanged = true;
            newSortOrder = values.sortOrder ?? before?.sortOrder;
        }

        // ── Name & Description Diffing & Translation ──
        const textToTranslate: Record<string, { en?: string; pt?: string }> = {};

        if (hasChanged(before?.name, values.name)) {
            textToTranslate.name = {
                en: values.name?.en,
                pt: values.name?.pt,
            };
        }

        if (hasChanged(before?.description, values.description)) {
            textToTranslate.description = {
                en: values.description?.en || "",
                pt: values.description?.pt || "",
            };
        }

        // Only invoke translation API if name or description changed
        if (Object.keys(textToTranslate).length > 0) {
            const translated = await translateObject(textToTranslate, lang);

            if (!translated) {
                toast.error("Translation failed!", { id: toastId });
                setIsSubmitting(false);
                return;
            }

            if (translated.name) mainPayload.name = translated.name;
            if (translated.description) mainPayload.description = translated.description;
        }

        // ── isActive ──
        if (hasChanged(before?.isActive, values.isActive)) {
            mainPayload.isActive = values.isActive ?? true;
        }

        // ── Early return if nothing changed at all ──
        const hasMainPayloadChanges = Object.keys(mainPayload).length > 0;

        if (!hasMainPayloadChanges && !isSortOrderChanged) {
            toast.info("No changes detected", { id: toastId });
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Fire sort order API separately if changed
            if (isSortOrderChanged) {
                const sortResult = await updateSectionSortOrder(
                    { sortOrder: newSortOrder },
                    section?._id
                );
                console.log("hit");
                if (!sortResult?.success) {
                    toast.error(sortResult?.message || "Failed to update sort order", { id: toastId });
                    setIsSubmitting(false);
                    return;
                }
            }

            // 2. Fire main update API if general fields changed
            if (hasMainPayloadChanges) {
                console.log("hit 2");
                const result = await updateMenuSection(mainPayload, section?._id, menuId);

                if (!result?.success) {
                    if (result?.data?.errorSources) {
                        result.data.errorSources.forEach(
                            (err: { path: string; message: string }) => {
                                toast.error(err?.message, { id: toastId });
                            }
                        );
                    } else {
                        toast.error(result?.message || "Section update failed", { id: toastId });
                    }
                    setIsSubmitting(false);
                    return;
                }
            }

            toast.success("Section updated successfully!", { id: toastId });
            form.reset(values);
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form when dialog closes
    const handleOpenChange = (value: boolean) => {
        if (!value) {
            form.reset();
        }
        onOpenChange(value);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="bg-[#DC3173] pt-6 pb-2 text-white px-4">
                    <DialogTitle className="text-xl font-semibold">
                        {t("update_section")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-white">
                        {t("update_you_section_details_below")}
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Form {...form}>
                        <MenuSectionForm
                            t={t}
                            isSubmitting={isSubmitting}
                            form={form}
                            selectedLanguage={lang}
                            onSubmit={onSubmit}
                            type="update"
                        />
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditMenuSection;