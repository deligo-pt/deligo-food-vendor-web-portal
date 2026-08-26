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
import { updateMenuSection } from "@/src/services/dashboard/menu/menu.service";
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
        const payload: Record<string, unknown> = {};

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

            if (translated.name) payload.name = translated.name;
            if (translated.description) payload.description = translated.description;
        }

        // ── sortOrder ──
        if (hasChanged(before?.sortOrder, values.sortOrder)) {
            payload.sortOrder = values.sortOrder ?? 0;
        }

        // ── isActive ──
        if (hasChanged(before?.isActive, values.isActive)) {
            payload.isActive = values.isActive ?? true;
        }

        // ── Early return if no changes ──
        if (Object.keys(payload).length === 0) {
            toast.info("No changes detected", { id: toastId });
            setIsSubmitting(false);
            return;
        }

        // ── Send Payload to API ──
        const result = await updateMenuSection(payload, section?._id, menuId,);

        if (result?.success) {
            toast.success(
                result?.message || "Section updated successfully!",
                { id: toastId }
            );
            form.reset(values);
            onOpenChange(false);
            setIsSubmitting(false);
            return;
        }

        if (result?.data?.errorSources) {
            result.data.errorSources.forEach(
                (err: { path: string; message: string }) => {
                    toast.error(err?.message, { id: toastId });
                }
            );
            setIsSubmitting(false);
            return;
        }

        toast.error(result?.message || "Section update failed", {
            id: toastId,
        });
        setIsSubmitting(false);
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