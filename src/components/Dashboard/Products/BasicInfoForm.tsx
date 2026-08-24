import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import { TProductCategoryResponse } from "@/src/types/category.type";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

type BasicInfoFormValues = {
    name: {
        en?: string;
        pt?: string;
    };
    category: string;
    additionalCategories?: string[];
};

interface IProps {
    form: UseFormReturn<BasicInfoFormValues>;
    productCategories: TProductCategoryResponse[];
    selectedLanguage: "en" | "pt";
}

const BasicInfoForm = ({
    form,
    productCategories,
    selectedLanguage,
}: IProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold text-gray-800">
                {t("basic_information")}
            </h2>

            {/* Product Name - EN */}
            {selectedLanguage === "en" && (
                <FormField
                    control={form.control}
                    name="name.en"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="block text-sm font-medium text-gray-700">
                                {t("product_name")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={t("product_name_placeholder")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {/* Product Name - PT */}
            {selectedLanguage === "pt" && (
                <FormField
                    control={form.control}
                    name="name.pt"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="block text-sm font-medium text-gray-700">
                                {t("product_name")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={t("product_name_placeholder")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {/* Main Category */}
            <FormField
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                    <FormItem className="gap-1">
                        <FormLabel className="block text-sm font-medium text-gray-700">
                            {t("product_category")}
                        </FormLabel>
                        <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                    className={cn(
                                        "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10",
                                        fieldState.invalid
                                            ? "border-destructive"
                                            : "border-gray-300"
                                    )}
                                >
                                    <SelectValue
                                        placeholder={t("select_category_placeholder")}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {productCategories?.map((category) => (
                                        <SelectItem key={category?._id} value={category?._id}>
                                            {category?.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Additional Categories - Multi Select (Optional) */}
            <FormField
                control={form.control}
                name="additionalCategories"
                render={({ field, fieldState }) => {
                    const selected = Array.isArray(field.value) ? field.value : [];

                    const handleSelect = (categoryId: string) => {
                        if (!selected.includes(categoryId)) {
                            field.onChange([...selected, categoryId]);
                        }
                    };

                    const handleRemove = (categoryId: string) => {
                        field.onChange(selected.filter((id) => id !== categoryId));
                    };

                    // Optional: prevent selecting the main category again
                    const mainCategoryId = form.watch("category");

                    return (
                        <FormItem className="gap-1">
                            <FormLabel className="block text-sm font-medium text-gray-700">
                                {t("additional_categories")}{" "}
                                <span className="text-gray-400 text-xs font-normal">
                                    ({t("optional")})
                                </span>
                            </FormLabel>

                            {/* Selected Badges */}
                            {selected.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3 p-2 border border-dashed rounded-lg bg-gray-50/50">
                                    {selected.map((id) => {
                                        const cat = productCategories.find((c) => c._id === id);
                                        return (
                                            <Badge
                                                key={id}
                                                variant="secondary"
                                                className="flex items-center gap-1 bg-[#DC3173]/10 text-[#DC3173] hover:bg-[#DC3173]/20 px-3 py-1 text-sm"
                                            >
                                                {cat?.name || id}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(id)}
                                                    className="rounded-full outline-none hover:bg-[#DC3173]/20 p-0.5"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}

                            <FormControl>
                                <Select value="" onValueChange={handleSelect}>
                                    <SelectTrigger
                                        className={cn(
                                            "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10",
                                            fieldState.invalid
                                                ? "border-destructive"
                                                : "border-gray-300"
                                        )}
                                    >
                                        <SelectValue
                                            placeholder={t("select_additional_categories") || "Select additional categories"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productCategories?.length === 0 ? (
                                            <div className="p-2 text-sm text-gray-500">
                                                {t("no_items_found")}
                                            </div>
                                        ) : (
                                            productCategories.map((category) => {
                                                const isSelected = selected.includes(category._id);
                                                const isMainCategory = category._id === mainCategoryId;

                                                return (
                                                    <SelectItem
                                                        key={category._id}
                                                        value={category._id}
                                                        disabled={isSelected || isMainCategory}
                                                        className="capitalize"
                                                    >
                                                        {category.name}
                                                        {isSelected && " ✓"}
                                                        {isMainCategory && " (Main)"}
                                                    </SelectItem>
                                                );
                                            })
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        </motion.div>
    );
};

export default BasicInfoForm;