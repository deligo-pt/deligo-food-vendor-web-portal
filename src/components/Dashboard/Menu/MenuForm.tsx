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
import { cn } from "@/lib/utils";
import { CreateMenuFormValues } from "./CreateMenu";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";


const DAYS_OF_WEEK = [
    { value: "MON", labelKey: "monday" },
    { value: "TUE", labelKey: "tuesday" },
    { value: "WED", labelKey: "wednesday" },
    { value: "THU", labelKey: "thursday" },
    { value: "FRI", labelKey: "friday" },
    { value: "SAT", labelKey: "saturday" },
    { value: "SUN", labelKey: "sunday" },
] as const;

interface MenuFormProps {
    form: UseFormReturn<CreateMenuFormValues>;
    onSubmit: (values: CreateMenuFormValues) => void | Promise<void>;
    selectedLanguage: "en" | "pt";
    t: (key: string) => string;
    isSubmitting: boolean;
    type: string;
}

const MenuForm = ({ form, onSubmit, selectedLanguage, t, isSubmitting, type }: MenuFormProps) => {

    const toggleDay = (day: (typeof DAYS_OF_WEEK)[number]["value"]) => {
        const current = form.getValues("availability.daysOfWeek") ?? [];
        const next = current.includes(day)
            ? current.filter((d) => d !== day)
            : [...current, day];

        form.setValue("availability.daysOfWeek", next, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

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
                                {t("menu_name")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={
                                        t("menu_name_placeholder")}
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
                                        t("description_placeholder")}
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

            {/* ── Availability (optional) ── */}
            <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                <h3 className="text-sm font-semibold text-gray-800">
                    {t("availability") || "Availability"}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                    </span>
                </h3>

                {/* Days */}
                <FormField
                    control={form.control}
                    name="availability.daysOfWeek"
                    render={() => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {t("days_of_week")}
                            </FormLabel>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {DAYS_OF_WEEK.map((day) => {
                                    const selected = form.watch("availability.daysOfWeek")?.includes(day.value) ?? false;

                                    return (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            className={cn(
                                                "px-3 py-1.5 text-sm rounded-full border transition-all",
                                                selected
                                                    ? "bg-[#DC3173] text-white border-[#DC3173]"
                                                    : "bg-white text-gray-600 border-gray-300 hover:border-[#DC3173]"
                                            )}
                                        >
                                            {t(day.labelKey) || day.value}
                                        </button>
                                    );
                                })}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Times */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="availability.startTime"
                        render={({ field }) => (
                            <FormItem className="gap-1">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    {t("start_time")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="time"
                                        {...field}
                                        value={field.value ?? ""}
                                        className="h-10 focus:border-[#DC3173] focus:ring-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="availability.endTime"
                        render={({ field }) => (
                            <FormItem className="gap-1">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    {t("end_time")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="time"
                                        {...field}
                                        value={field.value ?? ""}
                                        className="h-10 focus:border-[#DC3173] focus:ring-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* ── Sort Order + Active ── */}
            <div className="grid grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                        <FormItem className="gap-1">
                            <FormLabel className="text-sm font-medium text-gray-700">
                                {t("sort_order")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    {...field}
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
                                {t("lower_number_will_appear")}
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
                                    {t("is_active")}
                                </FormLabel>
                                <FormDescription className="text-xs">
                                    {t("is_active_desc") }
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
                        ? <Loader2 />
                        : type === 'create' ? t("create_menu") : t("update_menu")}
                </Button>
            </div>
        </form>
    );
};

export default MenuForm;