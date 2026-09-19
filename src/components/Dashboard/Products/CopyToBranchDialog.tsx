"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { TVendor } from "@/src/types/vendor.type";
import { cn } from "@/lib/utils";
import { Building2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { copyProductToBranchReq } from "@/src/services/dashboard/products/products";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: string;
    branches: TVendor[];
    t: (key: string) => string;
}

export default function CopyToBranchDialog({
    open,
    onOpenChange,
    productId,
    branches,
    t,
}: Props) {
    const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setSelectedVendorId(null);
        onOpenChange(false);
    };

    const handleSubmit = async () => {
        if (!selectedVendorId) return;

        setIsSubmitting(true);
        const toastId = toast.loading(t("copying_product") || "Copying product...");

        try {
            const result = await copyProductToBranchReq(selectedVendorId, productId);

            if (result?.success) {
                toast.success(result?.message || "Product copied successfully", {
                    id: toastId,
                });
                handleClose();
            } else {
                toast.error(result?.message || "Failed to copy product", {
                    id: toastId,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <TitleHeader
                        title={t("copy_to_branch") || "Copy to Branch"}
                        subtitle={
                            t("select_a_branch_to_copy_this_product") ||
                            "Select a branch to copy this product"
                        }
                    />
                </DialogHeader>

                <div className="px-6 pb-2">
                    {branches?.length === 0 ? (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            {t("no_branches_found") || "No branches found"}
                        </div>
                    ) : (
                        <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
                            {branches.map((branch) => {
                                const vendorId = branch.userId;
                                const name =
                                    `${branch.name?.firstName || "N/A"} ${branch.name?.lastName}` ||
                                    "N/A";
                                const isSelected = selectedVendorId === vendorId;

                                return (
                                    <button
                                        key={vendorId}
                                        type="button"
                                        onClick={() => setSelectedVendorId(vendorId as string)}
                                        className={cn(
                                            "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                                            isSelected
                                                ? "border-[#DC3173] bg-[#DC3173]/5"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                                isSelected
                                                    ? "bg-[#DC3173]/10 text-[#DC3173]"
                                                    : "bg-gray-100 text-gray-500"
                                            )}
                                        >
                                            <Building2 className="h-5 w-5" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-gray-900 truncate">
                                                {name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {t("id")}: {vendorId}
                                            </p>
                                        </div>

                                        {isSelected && (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DC3173] text-white">
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t px-6 py-4 bg-gray-50/80">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        {t("cancel") || "Cancel"}
                    </Button>

                    <Button
                        type="button"
                        disabled={!selectedVendorId || isSubmitting}
                        onClick={handleSubmit}
                        className="bg-[#DC3173] hover:bg-[#c71d62] text-white min-w-[120px]"
                    >
                        {isSubmitting
                            ? t("copying") || "Copying..."
                            : t("copy_product") || "Copy Product"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}