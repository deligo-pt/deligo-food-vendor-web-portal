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
import {updateMenu } from "@/src/services/dashboard/menu/menu.service";
import MenuForm from "./MenuForm";
import { IMenu } from "@/src/types/menu.type";


export type CreateMenuFormValues = z.infer<ReturnType<typeof createMenuSchema>>;


const EditMenu = ({ menu }: { menu: IMenu }) => {
    const { t, lang } = useTranslation();
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

        const payload: Record<string, unknown> = {};

        // ── Name ──
        if (hasChanged(before?.name, values.name)) {
            const namePayload = {
                en: values.name?.en,
                pt: values.name?.pt,
            };

            const translated = await translateObject(
                { name: namePayload },
                lang
            );

            if (!translated) {
                toast.error("Translation failed!", { id: toastId });
                setIsSubmitting(false);
                return;
            }
            payload.name = translated.name;
        }

        // ── Description ──
        if (hasChanged(before?.description, values.description)) {
            const descPayload = {
                en: values.description?.en || "",
                pt: values.description?.pt || "",
            };

            const translated = await translateObject(
                { description: descPayload },
                lang
            );

            if (!translated) {
                toast.error("Translation failed!", { id: toastId });
                setIsSubmitting(false);
                return;
            }
            payload.description = translated.description;
        }

        // ── Availability ──
        if (hasChanged(before?.availability, values.availability)) {
            payload.availability = values.availability;
        }

        // ── sortOrder ──
        if (hasChanged(before?.sortOrder, values.sortOrder)) {
            payload.sortOrder = values.sortOrder ?? 0;
        }

        // ── isActive ──
        if (hasChanged(before?.isActive, values.isActive)) {
            payload.isActive = values.isActive ?? true;
        }

        if (Object.keys(payload).length === 0) {
            toast.info("No changes detected", { id: toastId });
            setIsSubmitting(false);
            return;
        }

        const result = await updateMenu(payload, menu?._id);

        if (result?.success) {
            toast.success(
                result?.message || "Menu updated successfully!",
                { id: toastId }
            );
            form.reset(values);
            setIsSubmitting(false);
            return;
        }

        if (result?.data?.errorSources) {
            result.data.errorSources.forEach(
                (err: { path: string; message: string }) => {
                    toast.error(err.message, { id: toastId });
                }
            );
            setIsSubmitting(false);
            return;
        }

        toast.error(result?.message || "Menu update failed", {
            id: toastId,
        });
        setIsSubmitting(false);
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