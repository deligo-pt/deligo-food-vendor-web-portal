import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CreateMenuSectionFormValues } from "./AddSection";


interface MenuFormProps {
    form: UseFormReturn<CreateMenuSectionFormValues>;
    onSubmit: (values: CreateMenuSectionFormValues) => void | Promise<void>;
    selectedLanguage: "en" | "pt";
    t: (key: string) => string;
    isSubmitting: boolean;
    type: string;
}

const MenuSectionForm = ({ form, onSubmit, selectedLanguage, t, isSubmitting, type }: MenuFormProps) => {

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6"
        >
            {/* ── Name ── */}
            {selectedLanguage === "en" ? (
                <FormField
                    control={form.control}
                    name="name.en"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="block text-sm font-medium text-gray-700">
                                {t("menu_name") || "Menu Name"} (EN)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        t("menu_name_placeholder") ||
                                        "e.g. Lunch Menu"
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ) : (
                <FormField
                    control={form.control}
                    name="name.pt"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="block text-sm font-medium text-gray-700">
                                {t("menu_name") || "Menu Name"} (PT)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        t("menu_name_placeholder") ||
                                        "ex. Menu de Almoço"
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-[#DC3173] outline-none h-10"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {/* ── Description (optional) ── */}
            {selectedLanguage === "en" ? (
                <FormField
                    control={form.control}
                    name="description.en"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="block text-sm font-medium text-gray-700">
                                {t("description") || "Description"} (EN)
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder={
                                        t("description_placeholder") ||
                                        "Available every day for lunch and dinner"
                                    }
                                    className="min-h-[90px] resize-none focus:border-[#DC3173] focus:ring-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ) : (
                <FormField
                    control={form.control}
                    name="description.pt"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="block text-sm font-medium text-gray-700">
                                {t("description") || "Description"} (PT)
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder={
                                        t("description_placeholder") ||
                                        "Disponível todos os dias para almoço e jantar"
                                    }
                                    className="min-h-[90px] resize-none focus:border-[#DC3173] focus:ring-0"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}


            {/* ── Sort Order + Active ── */}
            <div className="grid grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {t("sort_order") || "Sort order"}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    {...field}
                                    // keep it as number for the form
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ""
                                                ? 0
                                                : Number(e.target.value)
                                        )
                                    }
                                    value={field.value ?? 0}
                                    className="h-10 focus:border-[#DC3173] focus:ring-0"
                                />
                            </FormControl>
                            <FormDescription className="text-xs">
                                Lower numbers appear first
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-sm font-medium">
                                    {t("is_active") || "Active"}
                                </FormLabel>
                                <FormDescription className="text-xs">
                                    {t("is_active_desc") ||
                                        "Show this menu to customers"}
                                </FormDescription>
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

            {/* Actions */}
            <div className="pt-4 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                >
                    {t("reset") || "Reset"}
                </Button>
                <Button
                    type="submit"
                    className="bg-[#DC3173] hover:bg-[#c02a66] text-white"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? t("saving")
                        : type === 'add' ? t("add_section") : t("update_section")}
                </Button>
            </div>
        </form>
    );
};

export default MenuSectionForm;