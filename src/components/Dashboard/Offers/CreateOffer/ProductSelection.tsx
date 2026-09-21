/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { TProduct } from "@/src/types/product.type";
import { useMemo } from "react";

interface ProductSelectorProps {
    products: TProduct[];
    lang: string;
    selectionMode?: "multi" | "single";
    selectedIds: string[];
    onToggle: (productId: string) => void;
    /** kept for API compat – category select-all is disabled */
    onToggleCategory?: (categoryId: string, selectAll: boolean) => void;
    className?: string;
    height?: string;
}

export function ProductSelector({
    products,
    lang,
    selectionMode = "multi",
    selectedIds,
    onToggle,
    className,
    height = "h-72",
}: ProductSelectorProps) {
    const productsByCategory = useMemo(() => {
        const groups: Record<
            string,
            { categoryId: string; categoryName: string; products: TProduct[] }
        > = {};

        products.forEach((p) => {
            const cat = (p as any).category;
            const catId = cat?._id || "uncategorized";
            const catName = cat?.name?.[lang] || cat?.name || "Uncategorized";

            if (!groups[catId]) {
                groups[catId] = {
                    categoryId: catId,
                    categoryName: catName,
                    products: [],
                };
            }
            groups[catId].products.push(p);
        });

        return Object.values(groups);
    }, [products, lang]);

    return (
        <div
            className={cn(
                "border border-gray-200 rounded-xl overflow-y-auto bg-white",
                height,
                className,
            )}
        >
            {productsByCategory.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-10">
                    No products found
                </p>
            )}

            {productsByCategory.map(
                ({ categoryId, categoryName, products: catProducts }) => (
                    <div
                        key={categoryId}
                        className="border-b border-gray-100 last:border-b-0"
                    >
                        {/* Category label only – no select-all checkbox */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 sticky top-0 z-1 border-b border-gray-100">
                            <span className="font-semibold text-[13px] text-gray-800 tracking-wide uppercase">
                                {categoryName}
                            </span>
                            <span className="text-xs text-gray-400 ml-auto tabular-nums">
                                {catProducts.length} item
                                {catProducts.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <div className="ml-6 py-1 pr-2">
                            {catProducts.map((product) => {
                                const pid = product._id as string;
                                const isChecked = selectedIds.includes(pid);

                                return (
                                    <label
                                        key={pid}
                                        className={cn(
                                            "flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer select-none transition-colors",
                                            isChecked ? "bg-[#DC3173]/8" : "hover:bg-gray-50",
                                        )}
                                    >
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={() => onToggle(pid)}
                                            className="data-[state=checked]:bg-[#DC3173] data-[state=checked]:border-[#DC3173]"
                                        />
                                        <span
                                            className={cn(
                                                "text-sm",
                                                isChecked
                                                    ? "text-gray-900 font-medium"
                                                    : "text-gray-700",
                                            )}
                                        >
                                            {product.name?.[lang as "en" | "pt"] ||
                                                (product as any).name ||
                                                "—"}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ),
            )}
        </div>
    );
}