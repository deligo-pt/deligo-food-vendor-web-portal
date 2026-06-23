/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { useTranslation } from '@/src/hooks/use-translation';
import { TTax } from "@/src/types/tax.type";
import { motion } from 'framer-motion';

interface IProps {
    form: any;
    watchVariations: any;
    watchPrice: any;
    watchDiscount: any;
    watchTaxId: any;
    taxesData: TTax[];
}

const PricingForm = ({ form, watchVariations, watchPrice, watchDiscount, watchTaxId, taxesData }: IProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            transition={{
                duration: 0.3,
            }}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold text-gray-800">
                {t("pricing_information")}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {watchVariations.length === 0 && (
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="gap-1">
                                <FormLabel
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    {t("price_E")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        min={0}
                                        value={String(field.value)}
                                        onChange={(e) =>
                                            field.onChange(Number(e.target.value))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel
                                htmlFor="discount"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t("discount_2")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={String(field.value)}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel
                                htmlFor="tax"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t("tax_2")}
                            </FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10">
                                        <SelectValue placeholder="Select tax" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {taxesData?.map((tax) => (
                                            <SelectItem key={tax._id} value={tax._id}>
                                                {tax.taxName} ({tax.taxRate}%)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {!!watchPrice && watchPrice > 0 && watchDiscount >= 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                        <span className="text-gray-700">
                            {t("original_price")}:
                        </span>
                        <span className="font-medium">€ {watchPrice}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-700">
                            {t("discount")} ({watchDiscount}%):
                        </span>
                        <span className="font-medium text-red-500">
                            - €{" "}
                            {((watchPrice * watchDiscount) / 100).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-700">
                            {t("tax")} (
                            {
                                taxesData?.find((tax) => tax._id === watchTaxId)
                                    ?.taxRate
                            }
                            %):
                        </span>
                        <span className="font-medium">
                            + €{" "}
                            {(
                                (watchPrice *
                                    (1 - watchDiscount / 100) *
                                    (taxesData?.find(
                                        (tax) => tax._id === watchTaxId,
                                    )?.taxRate || 0)) /
                                100
                            ).toFixed(2)}
                        </span>
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between">
                        <span className="font-semibold">
                            {t("final_price")}:
                        </span>
                        <span className="font-bold text-[#DC3173]">
                            €{" "}
                            {(
                                watchPrice *
                                (1 - watchDiscount / 100) *
                                (1 +
                                    (taxesData?.find(
                                        (tax) => tax._id === watchTaxId,
                                    )?.taxRate || 0) /
                                    100)
                            ).toFixed(2)}
                        </span>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default PricingForm;