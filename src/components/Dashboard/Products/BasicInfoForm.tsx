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
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import { TProductCategory } from "@/src/types/category.type";
import { motion } from "framer-motion";
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
    productCategories: TProductCategory[];
    selectedLanguage: "en" | "pt";
}

const BasicInfoForm = ({
    form,
    productCategories,
    selectedLanguage,
}: IProps) => {
    const { t, lang } = useTranslation();

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
                                            {category?.name?.[lang]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

        </motion.div>
    );
};

export default BasicInfoForm;