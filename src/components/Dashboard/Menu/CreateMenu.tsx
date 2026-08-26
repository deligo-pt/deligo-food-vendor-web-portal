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
import { createMenu } from "@/src/services/dashboard/menu/menu.service";
import MenuForm from "./MenuForm";


export type CreateMenuFormValues = z.infer<ReturnType<typeof createMenuSchema>>;


const CreateMenu = () => {
    const { t, lang } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CreateMenuFormValues>({
        resolver: zodResolver(createMenuSchema(lang)),
        defaultValues: {
            name: { en: "", pt: "" },
            description: { en: "", pt: "" },
            availability: {
                daysOfWeek: [],
                startTime: "",
                endTime: "",
            },
            sortOrder: 0,
            isActive: true,
        },
    });

    // ── Real submit handler lives here ──
    const onSubmit = async (values: CreateMenuFormValues) => {
        const toastId = toast.loading("Creating menu...");
        setIsSubmitting(true);

        const translatedFiels = {
            name: {
                en: values?.name?.en,
                pt: values?.name?.pt,
            },
            description: {
                en: values?.description?.en || "",
                pt: values?.description?.pt || "",
            },

        }
        const translated = await translateObject(translatedFiels, lang);

        if (!translated) {
            toast.error("Translation failed!", { id: toastId });
            setIsSubmitting(false);
            return;
        };

        const payload = {
            name: translated.name,
            description: translated.description,
            availability: values.availability,
            sortOrder: values.sortOrder ?? 0,
            isActive: values.isActive ?? true,
        };

        const result = await createMenu(payload);

        if (result?.success) {
            toast.success(result?.message || "Menu created successfully!", { id: toastId });
            form.reset();
            setIsSubmitting(false);
            return;
        }
        if (result?.data?.errorSources) {
            result?.data?.errorSources?.map((err: { path: string, message: string }) => (
                toast.error(err?.message, { id: toastId })
            ));
            setIsSubmitting(false);
            return;
        } else {
            toast.error(result.message || "Menu creation failed", {
                id: toastId,
            });
        }
        console.log(result);
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
                title={t("add_new_item")}
                subtitle={t("fill_the_details_to_add_new_food_item")}
            />

            <Form {...form}>
                <MenuForm
                    t={t}
                    isSubmitting={isSubmitting}
                    form={form}
                    selectedLanguage={lang}
                    onSubmit={onSubmit}
                    type="create"
                />
            </Form>
        </motion.div>
    );
};

export default CreateMenu;