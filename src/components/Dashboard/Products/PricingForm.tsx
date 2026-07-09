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
    watchDiscountType: any;
    taxesData: TTax[];
}

const PricingForm = ({ form, watchVariations, watchPrice, watchDiscountType, watchDiscount, watchTaxId, taxesData }: IProps) => {
    const { t } = useTranslation();

    const inputPrice = watchPrice;
    const taxRate = taxesData?.find((tax) => tax._id === watchTaxId)?.taxRate || 0;

    const discountAmount =
        watchDiscountType === "PERCENTAGE"
            ? inputPrice * (watchDiscount / 100)
            : Math.min(watchDiscount, inputPrice);

    const finalPrice = Math.max(inputPrice - discountAmount, 0);

    const taxAmount = finalPrice * (taxRate / 100);

    // const basePrice = finalPrice - taxAmount;


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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
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
                    name="discountType"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t("select_discount_type")}
                            </FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERCENTAGE" defaultChecked>PERCENTAGE</SelectItem>
                                        <SelectItem value="FLAT">FLAT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel
                                htmlFor="discount"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t("discount_2")} {watchDiscountType === "PERCENTAGE" ? "(%)" : "(€)" }
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={0}
                                    max={
                                        watchDiscountType === "PERCENTAGE"
                                            ? 100
                                            : watchPrice || undefined
                                    }
                                    value={String(field.value)}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);

                                        if (watchDiscountType === "PERCENTAGE") {
                                            field.onChange(Math.min(value, 100));
                                        } else {
                                            field.onChange(Math.min(value, watchPrice || 0));
                                        }
                                    }}
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
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-700">
                            {t("original_price")}:
                        </span>
                        <span className="font-medium">
                            € {inputPrice.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-700">
                            {t("discount")} (
                            {watchDiscountType === "PERCENTAGE"
                                ? `${watchDiscount}%`
                                : `€ ${watchDiscount.toFixed(2)}`}
                            ):
                        </span>
                        <span className="font-medium text-red-500">
                            - € {discountAmount.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">
                            {t("final_price")} <span className="text-sm">(incl. {t("tax")} ({taxRate}%), €{taxAmount.toFixed(2)}) </span>:
                        </span>
                        <span className="font-bold text-[#DC3173]">
                            € {finalPrice.toFixed(2)}
                        </span>
                    </div>

                    {/* <div className="flex justify-between">
                        <span className="text-gray-700">
                            {t("tax")} ({taxRate}%):
                        </span>
                        <span className="font-medium">
                            € {taxAmount.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">
                            {t("base_price")}:
                        </span>
                        <span className="font-bold">
                            € {basePrice.toFixed(2)}
                        </span>
                    </div> */}
                </div>
            )}
        </motion.div>
    );
};

export default PricingForm;