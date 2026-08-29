"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/src/hooks/use-translation";
import { addProductCategoryReq } from "@/src/services/dashboard/categories/product-categories";
import { translateObject } from "@/src/utils/translation/translationObject";
import { productCategoryValidation } from "@/src/validations/product-categories/product-categories.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ActivitySquareIcon, FileTextIcon, LoaderIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";


type FormData = z.infer<typeof productCategoryValidation>;

export default function AddProductCategory() {
    const { t, lang } = useTranslation();
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(productCategoryValidation),
        defaultValues: {
            name: {
                en: "",
                pt: ""
            },
            isActive: true,
            currentLang: lang
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


    const onSubmit = async (data: FormData) => {
        const toastId = toast.loading("Adding category...");
        setIsSubmitting(true);

        const translated = await translateObject(data, lang);

        if (!translated) {
            toast.error("Translation failed", { id: toastId });
            setIsSubmitting(false);
            return;
        }

        const categoryData = {
            name: translated?.name,
            isActive: data.isActive
        }

        const result = await addProductCategoryReq(categoryData);

        if (result?.success) {
            toast.success(result.message || "Category added successfully!", {
                id: toastId,
            });
            form.reset();
            setIsSubmitting(false);
            router.push('/vendor/product-categories/all');
            return;
        }

        toast.error(result.message || "Failed to add category", {
            id: toastId,
        });
        setIsSubmitting(false);
        console.log(result);
        toast.dismiss()
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
            className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
            <div className="bg-linear-to-r from-[#DC3173] to-[#E95A9E] p-6 rounded-t-xl">
                <motion.h1
                    className="text-2xl font-bold text-white"
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.2,
                    }}
                >
                    {t("add_product_category")}
                </motion.h1>
                <motion.p
                    className="text-pink-100 mt-2"
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.3,
                    }}
                >
                    {t("create_new_product_category")}
                </motion.p>
            </div>
            <Form {...form}>
                <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="p-6 space-y-6"
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.4,
                    }}
                >
                    <div className="space-y-4">
                        {lang === 'en' && <FormField
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
                                            placeholder={t("eg_pizza")}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}

                        {lang === 'pt' && <FormField
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
                                            placeholder={t("eg_pizza")}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#DC3173] focus:border-[#DC3173] outline-none transition-all border-gray-300"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}

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
                    <div className="pt-4">
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#DC3173] hover:bg-[#DC3173]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DC3173] transition-all duration-200"
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                        >
                            {isSubmitting ? (
                                <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <>
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    {t("add_product_category")}
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            </Form>
        </motion.div>
    );
}
