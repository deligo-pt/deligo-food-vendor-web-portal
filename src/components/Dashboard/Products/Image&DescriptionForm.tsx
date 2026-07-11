/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "@/src/hooks/use-translation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ProductImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileTextIcon } from "lucide-react";

interface IProps {
    form: any;
    selectedLanguage: string;
}

const ImageAndDescriptionForm = ({ form, selectedLanguage }: IProps) => {
    const { t, i18n } = useTranslation();
    // State for inline AI description generator
    const [generatingDescription, setGeneratingDescription] = useState(false);
    const [descriptionLanguage, setDescriptionLanguage] = useState<"Portuguese" | "English">(
        i18n?.language === "pt" ? "Portuguese" : "English"
    );

    // AI description generation
    const generateDescription = async () => {
        const productName = form.getValues("name");
        const categoryId = form.getValues("category");
        const productImageUrl = form.getValues("images")?.[0];

        if (!productName) {
            toast.error(t("product_name_required") || "Product name is required");
            return;
        }

        setGeneratingDescription(true);
        try {
            const response = await fetch(
                "https://api-food.deligo.pt/api/v1/ai/generate-product-description",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productName,
                        productCategory: categoryId,
                        productImageUrl,
                        language: descriptionLanguage,
                    }),
                }
            );

            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const result = await response.json();
            if (result.success && result.data?.description) {
                form.setValue("description", result.data.description);
                toast.success(t("description_generated") || "Description generated!");
            } else {
                throw new Error(result.message || "Failed to generate description");
            }
        } catch (error) {
            console.error(error);
            toast.error(t("description_generation_failed") || "Failed to generate description");
        } finally {
            setGeneratingDescription(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold text-gray-800">{t("product_images")}</h2>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ImageUpload
                                        images={field.value}
                                        onChange={(urls) => field.onChange(urls)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex-1 border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-4">
                         <div>
                            <Label>{t("description")}</Label>
                            <FormField
                                control={form.control}
                                name={`description.${selectedLanguage}`}
                                render={({ field }) => (
                                    <FormItem className="mt-1">
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder={t("enter_product_description")}
                                                className="min-h-[120px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="border-t pt-4">
                            <Label className="mb-2 block">
                                {t("ai_generate_description") || "AI Generate Description"}
                            </Label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Select
                                    value={descriptionLanguage}
                                    onValueChange={(val) =>
                                        setDescriptionLanguage(val as "Portuguese" | "English")
                                    }
                                >
                                    <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Portuguese">Português</SelectItem>
                                        <SelectItem value="English">English</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    onClick={generateDescription}
                                    disabled={generatingDescription || !form.getValues("name")}
                                    className="bg-[#DC3173] hover:bg-[#DC3173]/90"
                                >
                                    {generatingDescription ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            {t("generating") || "Generating..."}
                                        </>
                                    ) : (
                                        <>
                                            <FileTextIcon className="h-4 w-4 mr-2" />
                                            {t("generate") || "Generate"}
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {t("generate_description_hint")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ImageAndDescriptionForm;