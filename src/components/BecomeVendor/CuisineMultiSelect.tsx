import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TCuisine } from "@/src/types/cuisine.type";
import { Briefcase, Check, X } from "lucide-react";
import { useState } from "react";

interface CuisineMultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    cuisines: TCuisine[];
    invalid?: boolean;
    placeholder: string;
    t: (key: string) => string;
}

export function CuisineMultiSelect({
    value,
    onChange,
    cuisines,
    invalid,
    placeholder,
    t,
}: CuisineMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [tempSelected, setTempSelected] = useState<string[]>(value);

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setTempSelected(value);
        }
        setOpen(isOpen);
    };

    const handleToggle = (cuisine: string) => {
        setTempSelected((prev) =>
            prev.includes(cuisine)
                ? prev.filter((c) => c !== cuisine)
                : [...prev, cuisine]
        );
    };

    const handleRemoveCuisine = (cuisineToRemove: string) => {
        onChange(value.filter((item) => item !== cuisineToRemove));
    };

    const handleAddSelected = () => {
        onChange(tempSelected);
        setOpen(false);
    };

    return (
        <div>
            {/* Selected badges */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 p-2 border border-dashed rounded-lg bg-gray-50/50">
                    {value.map((cuisine) => {
                        const displayName =
                            cuisines?.find((c) => c.slug === cuisine || c.name === cuisine)
                                ?.name || cuisine;

                        return (
                            <Badge
                                key={cuisine}
                                variant="secondary"
                                className="flex items-center gap-1 bg-[#DC3173]/10 text-[#DC3173] hover:bg-[#DC3173]/20 transition-all capitalize px-3 py-1 text-sm font-medium"
                            >
                                {displayName}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCuisine(cuisine)}
                                    className="rounded-full outline-none hover:bg-[#DC3173]/20 p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        );
                    })}
                </div>
            )}

            <div className="relative">
                <Briefcase className="absolute left-3 top-3.5 text-[#DC3173]/80" />
                <Select open={open} onOpenChange={handleOpenChange} value="">
                    <SelectTrigger
                        className={cn(
                            "pl-11 pr-4 h-12 w-full bg-white/90 text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-[#DC3173]/70 hover:shadow-md transition-all cursor-pointer",
                            invalid
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "border-gray-300"
                        )}
                        style={{ height: "3rem" }}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>

                    <SelectContent className="p-0">
                        <div className="max-h-60 overflow-y-auto py-1">
                            {cuisines?.length < 1 ? (
                                <div className="p-3 text-sm text-gray-500">
                                    {t("no_items_found")}
                                </div>
                            ) : (
                                cuisines?.map((type, idx) => {
                                    const itemValue = type.slug;
                                    const isChecked = tempSelected.includes(itemValue);

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => handleToggle(itemValue)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 cursor-pointer select-none capitalize",
                                                isChecked
                                                    ? "bg-[#DC3173]/10 text-[#DC3173]"
                                                    : "hover:bg-gray-50"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                                                    isChecked
                                                        ? "border-[#DC3173] bg-[#DC3173] text-white"
                                                        : "border-gray-300"
                                                )}
                                            >
                                                {isChecked && (
                                                    <Check className="h-3 w-3" strokeWidth={3} />
                                                )}
                                            </div>
                                            <span>{type.name}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Bottom Add button */}
                        <div className="border-t p-2 sticky bottom-0 bg-white">
                            <Button
                                type="button"
                                onClick={handleAddSelected}
                                className="w-full h-10 rounded-lg bg-[#DC3173] hover:bg-[#c21c5e] text-white text-sm font-medium"
                            >
                                {t("add_selected")} ({tempSelected.length})
                            </Button>
                        </div>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}