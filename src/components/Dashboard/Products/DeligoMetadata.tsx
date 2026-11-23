/* eslint-disable @typescript-eslint/no-explicit-any */


import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from 'framer-motion';
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getEffectiveSdrDeposit } from "@/src/services/dashboard/sdr/sdr";
import { TSdrEffective } from "@/src/types/product.type";

/** The 2×1 switch's situation on Edit (Add Item has none: always free to switch). */
export type TTwoForOneInfo =
    | { status: "loading" }
    | { status: "ready" }
    /** The offers could not be read: the switch is not offered, rather than guessed. */
    | { status: "unknown" }
    /** An offer the switch must not touch already covers the product. */
    | { status: "locked"; reason: "ADMIN" | "SHARED"; title: string };

interface IProps {
    form: any;
    twoForOne?: TTwoForOneInfo;
}

const DeligoMetadata = ({ form, twoForOne = { status: "ready" } }: IProps) => {
    const { t } = useTranslation();
    // The SDR deposit in force, shown read-only beside the switch. `null`
    // while loading; any failure reads as "not active" (see the service).
    const [sdr, setSdr] = useState<TSdrEffective | null>(null);
    useEffect(() => {
        let cancelled = false;
        getEffectiveSdrDeposit().then((value) => {
            if (!cancelled) setSdr(value);
        });
        return () => {
            cancelled = true;
        };
    }, []);

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
                {t("deligo_metadata_information")}
            </h2>
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between gap-3">
                            <FormLabel
                                htmlFor="isFeatured"
                                className="text-sm text-gray-700"
                            >
                                {t("featured_product")}
                            </FormLabel>
                            <FormControl>
                                <Switch
                                    id="isFeatured"
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[#DC3173]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isAvailableForPreOrder"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between gap-3">
                            <FormLabel
                                htmlFor="isAvailableForPreOrder"
                                className="text-sm text-gray-700"
                            >
                                {t("available_for_pre_order")}
                            </FormLabel>
                            <FormControl>
                                <Switch
                                    id="isAvailableForPreOrder"
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[#DC3173]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 2×1: a buy-one-get-one-free offer for this product
                    (plan.md §10.2), made or ended when the product is saved. */}
                <FormField
                    control={form.control}
                    name="isTwoForOne"
                    render={({ field }) => (
                        <FormItem className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                                <FormLabel htmlFor="isTwoForOne" className="text-sm text-gray-700">
                                    {t("two_for_one_label")}
                                </FormLabel>
                                <p className="text-xs text-gray-500">
                                    {twoForOne.status === "loading" ? (
                                        <span role="status" aria-live="polite" className="inline-flex items-center gap-1.5">
                                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#DC3173]" aria-hidden />
                                            {t("two_for_one_loading")}
                                        </span>
                                    ) : twoForOne.status === "unknown" ? (
                                        <span className="text-amber-700">{t("two_for_one_unknown")}</span>
                                    ) : twoForOne.status === "locked" ? (
                                        <span className="text-amber-700">
                                            {t(twoForOne.reason === "ADMIN" ? "two_for_one_locked_admin" : "two_for_one_locked_shared").replace("{offer}", twoForOne.title)}
                                        </span>
                                    ) : (
                                        t("two_for_one_helper")
                                    )}
                                </p>
                            </div>
                            <FormControl>
                                <Switch
                                    id="isTwoForOne"
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={twoForOne.status !== "ready"}
                                    className="data-[state=checked]:bg-[#DC3173]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* SDR: the vendor decides which products carry the
                    container deposit; the amount is the admin's, shown here
                    read-only. */}
                <FormField
                    control={form.control}
                    name="sdrApplicable"
                    render={({ field }) => (
                        <FormItem className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                                <FormLabel
                                    htmlFor="sdrApplicable"
                                    className="text-sm text-gray-700"
                                >
                                    {t("sdr_container_deposit")}
                                </FormLabel>
                                <p className="text-xs text-gray-500">
                                    {sdr === null
                                        ? (
                                            // Loading: a spinner in the line the amount will take,
                                            // so nothing moves when it arrives.
                                            <span role="status" aria-live="polite" className="inline-flex items-center gap-1.5">
                                                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#DC3173]" aria-hidden />
                                                {t("sdr_loading")}
                                            </span>
                                        )
                                        : sdr.isActive
                                            ? <>
                                                {t("sdr_helper_active")}{" "}
                                                <span className="font-semibold text-gray-700">
                                                    +{sdr.depositAmount.toFixed(2)}&nbsp;€
                                                </span>
                                            </>
                                            : t("sdr_helper_inactive")}
                                </p>
                            </div>
                            <FormControl>
                                <Switch
                                    id="sdrApplicable"
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[#DC3173]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between gap-3">
                            <FormLabel
                                htmlFor="isActive"
                                className="text-sm text-gray-700"
                            >
                                {t("active_status")}
                            </FormLabel>
                            <FormControl>
                                <Switch
                                    id="isActive"
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[#DC3173]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </motion.div>
    );
};

export default DeligoMetadata;