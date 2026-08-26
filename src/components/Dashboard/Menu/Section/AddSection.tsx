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
import { addMenuSection } from "@/src/services/dashboard/menu/menu.service";

export type CreateMenuSectionFormValues = z.infer<
    ReturnType<typeof createMenuSectionSchema>
>;

interface IProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    menuId: string;
}

const AddMenuSection = ({ menuId, open, onOpenChange }: IProps) => {
    const { t, lang } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CreateMenuSectionFormValues>({
        resolver: zodResolver(createMenuSectionSchema(lang)),
        defaultValues: {
            name: { en: "", pt: "" },
            description: { en: "", pt: "" },
            sortOrder: 0,
            isActive: true,
        },
    });

    const onSubmit = async (values: CreateMenuSectionFormValues) => {
        const toastId = toast.loading("Adding section...");
        setIsSubmitting(true);

        const translatedFields = {
            name: {
                en: values?.name?.en,
                pt: values?.name?.pt,
            },
            description: {
                en: values?.description?.en || "",
                pt: values?.description?.pt || "",
            },
        };

        const translated = await translateObject(translatedFields, lang);

        if (!translated) {
            toast.error("Translation failed!", { id: toastId });
            setIsSubmitting(false);
            return;
        }

        const payload = {
            name: translated.name,
            description: translated.description,
            sortOrder: values.sortOrder ?? 0,
            isActive: values.isActive ?? true,
        };

        const result = await addMenuSection(payload, menuId);

        if (result?.success) {
            toast.success(
                result?.message || "Section added successfully!",
                { id: toastId }
            );
            form.reset();
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

        toast.error(result?.message || "Section added failed", {
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
                        {t("add_section")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-white">
                        {t("add_required_sections_under_each_menu")}
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
                            type="add"
                        />
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddMenuSection;