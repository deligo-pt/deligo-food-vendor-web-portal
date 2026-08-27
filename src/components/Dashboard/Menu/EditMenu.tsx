'use client';

import { Form } from "@/components/ui/form";
import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { createMenuSchema } from "@/src/validations/menu/menu.validation";
import TitleHeader from "../../TitleHeader/TitleHeader";
import { translateObject } from "@/src/utils/translation/translationObject";
import { toast } from "sonner";
import { updateMenu, updateMenuSortOrder } from "@/src/services/dashboard/menu/menu.service";
import MenuForm from "./MenuForm";
import { IMenu } from "@/src/types/menu.type";
import { useRouter } from "next/navigation";


export type CreateMenuFormValues = z.infer<ReturnType<typeof createMenuSchema>>;


const EditMenu = ({ menu }: { menu: IMenu }) => {
    const { t, lang } = useTranslation();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CreateMenuFormValues>({
        resolver: zodResolver(createMenuSchema(lang)),
        defaultValues: {
            name: {
                en: menu?.name?.en || "",
                pt: menu?.name?.pt || ""
            },
            description: {
                en: menu?.description?.en || "",
                pt: menu?.description?.pt || ""
            },
            availability: {
                daysOfWeek: menu?.availability?.daysOfWeek || [],
                startTime: menu?.availability?.startTime || "",
                endTime: menu?.availability?.endTime || "",
            },
            sortOrder: menu?.sortOrder || 0,
            isActive: menu?.isActive || true,
        },
    });

    const onSubmit = async (values: CreateMenuFormValues) => {
        const toastId = toast.loading("Updating menu...");
        setIsSubmitting(true);

        const hasChanged = (before: unknown, after: unknown): boolean => {
            return JSON.stringify(before) !== JSON.stringify(after);
        };

        const before = menu;
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

        // Only invoke translation API once if name or description changed
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

        // ── Availability ──
        if (hasChanged(before?.availability, values.availability)) {
            mainPayload.availability = values.availability;
        }

        // ── isActive ──
        if (hasChanged(before?.isActive, values.isActive)) {
            mainPayload.isActive = values.isActive ?? true;
        }

        // ── Early return if no changes detected ──
        const hasMainPayloadChanges = Object.keys(mainPayload).length > 0;

        if (!hasMainPayloadChanges && !isSortOrderChanged) {
            toast.info("No changes detected", { id: toastId });
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Trigger separate sortOrder API if changed
            if (isSortOrderChanged) {
                const sortResult = await updateMenuSortOrder(
                    { sortOrder: newSortOrder },
                    menu?._id
                );

                if (!sortResult?.success) {
                    toast.error(sortResult?.message || "Failed to update sort order", { id: toastId });
                    setIsSubmitting(false);
                    return;
                }
            }

            // 2. Trigger main update API if other attributes changed
            if (hasMainPayloadChanges) {
                const result = await updateMenu(mainPayload, menu?._id);

                if (!result?.success) {
                    if (result?.data?.errorSources) {
                        result.data.errorSources.forEach(
                            (err: { path: string; message: string }) => {
                                toast.error(err?.message, { id: toastId });
                            }
                        );
                    } else {
                        toast.error(result?.message || "Menu update failed", { id: toastId });
                    }
                    setIsSubmitting(false);
                    return;
                }
            }

            toast.success("Menu updated successfully!", { id: toastId });
            router.push('/vendor/menu/all');
            form.reset(values);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.5,
            }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden"
        >
            <TitleHeader
                title={t("update_menu")}
                subtitle={t("change_whatever_need_to_update")}
            />

            <Form {...form}>
                <MenuForm
                    t={t}
                    isSubmitting={isSubmitting}
                    form={form}
                    selectedLanguage={lang}
                    onSubmit={onSubmit}
                    type="update"
                />
            </Form>
        </motion.div>
    );
};

export default EditMenu;