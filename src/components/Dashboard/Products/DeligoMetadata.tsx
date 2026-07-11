/* eslint-disable @typescript-eslint/no-explicit-any */

import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from 'framer-motion';

interface IProps {
    form: any;
}

const DeligoMetadata = ({ form }: IProps) => {
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
                {t("deligo_metadata_information")}
            </h2>
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormControl>
                                <div className="">
                                    <FormLabel
                                        htmlFor="isFeatured"
                                        className="text-sm text-gray-700 flex items-center"
                                    >
                                        <Checkbox
                                            id="isFeatured"
                                            checked={!!field.value}
                                            onCheckedChange={(checked) =>
                                                field.onChange(checked)
                                            }
                                            className="h-4 w-4 text-[#DC3173] focus:ring-[#DC3173] border-gray-300 rounded data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173]"
                                        />
                                        {t("featured_product")}
                                    </FormLabel>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isAvailableForPreOrder"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormControl>
                                <div className="">
                                    <FormLabel
                                        htmlFor="isAvailableForPreOrder"
                                        className="text-sm text-gray-700 flex items-center"
                                    >
                                        <Checkbox
                                            id="isAvailableForPreOrder"
                                            checked={!!field.value}
                                            onCheckedChange={(checked) =>
                                                field.onChange(checked)
                                            }
                                            className="h-4 w-4 text-[#DC3173] focus:ring-[#DC3173] border-gray-300 rounded data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173]"
                                        />
                                        {t("available_for_pre_order")}
                                    </FormLabel>
                                </div>
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