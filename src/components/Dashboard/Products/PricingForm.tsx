/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/src/hooks/use-translation";
import { TTax } from "@/src/types/tax.type";
import { motion } from "framer-motion";
import { VatRateInfoIcon } from "./VatRatesInfo";
import PriceInput from "@/src/components/PriceInput/PriceInput";

interface IProps {
    form: any;
    watchVariations: any;
    watchPrice: any;
    watchDiscount: any;
    watchTaxId: any;
    watchDiscountType: any;
    taxesData: TTax[];
    /** An ⓘ on each VAT rate in the dropdown, explaining it. Add Item only, for now. */
    showVatInfo?: boolean;
}

const PricingForm = ({
    form,
    watchVariations,
    watchPrice,
    watchDiscountType,
    watchDiscount,
    watchTaxId,
    taxesData,
    showVatInfo = false,
}: IProps) => {
    const { t } = useTranslation();
    const inputPrice = watchPrice || 0;

    const selectedTax = taxesData?.find((tax) => tax._id === watchTaxId);
    const taxRate = selectedTax?.taxRate || 0;

    const discountAmount = watchDiscountType === "PERCENTAGE"
        ? inputPrice * ((watchDiscount || 0) / 100)
        : Math.min(watchDiscount || 0, inputPrice);

    const finalPrice = Math.max(inputPrice - discountAmount, 0);

    // Tax is included in finalPrice
    const taxAmount = finalPrice * (taxRate / (100 + taxRate));
    const netItemPrice = finalPrice - taxAmount;

    // Shown as Original − Customer Order Price, both to the cent, so the
    // three rows always add up. Rounding the discount on its own showed e.g.
    // €0.30 − €0.01 = €0.28 at 5% off. The customer price itself is unchanged
    // (it matches what the API stores).
    const shownDiscount = Number(inputPrice.toFixed(2)) - Number(finalPrice.toFixed(2));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold text-gray-800">
                {t("pricing_information")}
            </h2>

            {/* Form Fields — 2×2 until the row is wide enough for four. At four
                columns on a laptop the Portuguese tax name ("IVA - Taxa
                Intermédia (13%)") pushed its column past the card and was
                clipped. `min-w-0` on each field and on the tax select lets them
                shrink below their content instead of overflowing (FormItem is a
                grid of its own, so the field alone was not enough). */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 items-start">
                {watchVariations.length === 0 && (
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="gap-1 min-w-0">
                                <FormLabel
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    {t("price_E")}
                                </FormLabel>
                                <FormControl>
                                    <PriceInput
                                        id="price"
                                        ref={field.ref}
                                        name={field.name}
                                        placeholder="0.00"
                                        value={field.value}
                                        // An emptied box is `null`, never
                                        // `undefined`: the form library reads
                                        // `undefined` as "use the default", and
                                        // with the default now 0 a cleared box
                                        // snapped back to "0.00" and then
                                        // refused every key ("0.001").
                                        onValueChange={(value) => field.onChange(value ?? null)}
                                        onBlur={field.onBlur}
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
                        <FormItem className="gap-1 min-w-0">
                            <FormLabel className="block text-sm font-medium text-gray-700">
                                {t("select_discount_type")}
                            </FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Labels translated; the values sent stay PERCENTAGE / FLAT. */}
                                        <SelectItem value="PERCENTAGE">{t("discount_type_percentage")}</SelectItem>
                                        <SelectItem value="FLAT">{t("discount_type_flat")}</SelectItem>
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
                        <FormItem className="gap-1 min-w-0">
                            <FormLabel
                                htmlFor="discount"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t("discount_2")}{" "}
                                {watchDiscountType === "PERCENTAGE" ? "(%)" : "(€)"}
                            </FormLabel>
                            <FormControl>
                                {/* Free decimal typing for both kinds. The limits
                                    (100 % / the price) are checked by the schema
                                    with a message, not by silently rewriting
                                    the number mid-typing. Empty means no
                                    discount. */}
                                <PriceInput
                                    id="discount"
                                    ref={field.ref}
                                    name={field.name}
                                    placeholder="0"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    onBlur={field.onBlur}
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
                        <FormItem className="gap-1 min-w-0">
                            <FormLabel
                                htmlFor="tax"
                                className="block text-sm font-medium text-gray-700"
                            >
                                {t("tax_2")}
                            </FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10">
                                        {/* The rate on the right, outside the name: a long
                                            name is cut with "…", the rate never is. The
                                            full name is in the list. */}
                                        <SelectValue placeholder={t("select_tax")} className="min-w-0 flex-1 justify-between">
                                            {selectedTax && (
                                                <>
                                                    <span className="truncate">{selectedTax.taxName}</span>
                                                    <span className="shrink-0 font-medium text-gray-700">{selectedTax.taxRate}%</span>
                                                </>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {taxesData?.map((tax) => (
                                            <SelectItem
                                                key={tax._id}
                                                value={tax._id}
                                                {...(showVatInfo
                                                    ? {
                                                        "aria-describedby": `vat-info-${tax._id}`,
                                                        after: (
                                                            <VatRateInfoIcon
                                                                rate={tax.taxRate}
                                                                describedById={`vat-info-${tax._id}`}
                                                            />
                                                        ),
                                                    }
                                                    : {})}
                                            >
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

            {/* Live Preview Breakdown - Matching the design */}
            {/* Shown for €0 too: a free item is a real price now (17 Oct
                2026). Hidden only while the box is empty. */}
            {typeof watchPrice === "number" && watchPrice >= 0 && (
                <div className="mt-6">
                    <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white font-semibold">
                        {/* Header */}
                        <div className="bg-[#DC3173] px-5 py-3.5 flex items-center justify-between">
                            <h3 className="text-white font-semibold text-base">
                                {t("price_tax_breakdown")}
                            </h3>
                            <span className="text-xs font-medium bg-white/20 text-white px-2.5 py-1 rounded-full">
                                {t("live_preview")}
                            </span>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Original Price */}
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">{t("original_price")}</span>
                                <span className="font-medium text-gray-800">
                                    €{inputPrice.toFixed(2)}
                                </span>
                            </div>

                            {/* Discount */}
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-red-500">
                                    {t("discount")}{" "}
                                    {watchDiscountType === "PERCENTAGE"
                                        ? `(${watchDiscount || 0}%)`
                                        : ""}
                                </span>
                                <span className="font-medium text-red-500">
                                    -€{shownDiscount.toFixed(2)}
                                </span>
                            </div>

                            {/* Customer Order Price (highlighted box) */}
                            <div className="bg-[#FFF0F5] rounded-xl px-4 py-3.5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            {t("customer_order_price")}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">({t("incl_vat")})</p>
                                    </div>
                                    <span className="text-lg font-bold text-[#DC3173]">
                                        €{finalPrice.toFixed(2)}
                                    </span>
                                </div>

                                {/* Nested breakdown. Only once a VAT rate is chosen:
                                    before that the split is unknown, and showing
                                    "VAT (0%)" read as a VAT-exempt choice. */}
                                {!selectedTax ? (
                                    <p className="text-xs text-gray-500 pl-1">
                                        {t("select_vat_to_see_split")}
                                    </p>
                                ) : (
                                <div className="space-y-2 pl-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#DC3173]" />
                                            <span className="text-gray-600">
                                                {t("net_item_price")}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            €{netItemPrice.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#DC3173]" />
                                            <span className="text-gray-600">
                                                {t("govt_vat")} ({taxRate}%)
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            €{taxAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default PricingForm;