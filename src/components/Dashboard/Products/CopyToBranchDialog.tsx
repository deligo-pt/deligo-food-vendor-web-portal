"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { BranchStatusBadge } from "@/src/components/Dashboard/BranchManagement/BranchHelpers";
import { TVendor } from "@/src/types/vendor.type";
import { cn } from "@/lib/utils";
import { Building2, Check, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { copyProductsToBranchesReq } from "@/src/services/dashboard/products/products";
import {
    approvedBranches,
    branchDisplayName,
    branchTargetId,
    copyBlockedReason,
    describeCopyResult,
    isCopyTarget,
} from "@/src/utils/productCopy";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** `PROD-XXXXXX` codes — one from the product page, several from the catalogue. */
    productIds: string[];
    /**
     * Every product this vendor owns, rather than a list. Exclusive with
     * `productIds`, which is why the payload builder drops the list when it is set.
     */
    copyAllProducts?: boolean;
    branches: TVendor[];
    t: (key: string) => string;
    /** Called after a copy that actually moved something, so a caller can clear its selection. */
    onCopied?: () => void;
}

export default function CopyToBranchDialog({
    open,
    onOpenChange,
    productIds,
    copyAllProducts = false,
    branches,
    t,
    onCopied,
}: Props) {
    const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
    const [allBranches, setAllBranches] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Only approved branches can receive products. An unapproved one is not
    // rejected by the backend — it is dropped from the copy without a word — so
    // offering it would promise something that never happens.
    const eligible = useMemo(() => approvedBranches(branches), [branches]);
    const ineligible = useMemo(
        () => (branches ?? []).filter((branch) => !isCopyTarget(branch)),
        [branches],
    );

    const productCount = copyAllProducts ? 0 : productIds.length;
    const hasProducts = copyAllProducts || productIds.length > 0;
    const targetCount = allBranches ? eligible.length : selectedTargetIds.length;

    const handleClose = () => {
        setSelectedTargetIds([]);
        setAllBranches(false);
        onOpenChange(false);
    };

    const toggleTarget = (targetId: string) => {
        setAllBranches(false);
        setSelectedTargetIds((prev) =>
            prev.includes(targetId)
                ? prev.filter((id) => id !== targetId)
                : [...prev, targetId],
        );
    };

    const toggleAllBranches = () => {
        setSelectedTargetIds([]);
        setAllBranches((prev) => !prev);
    };

    const handleSubmit = async () => {
        const input = {
            productIds,
            copyAllProducts,
            // Exclusive with `copyToAllTargetSubVendors`, which is why the list is
            // emptied rather than sent alongside it.
            targetSubVendorIds: allBranches ? [] : selectedTargetIds,
            copyToAllTargetSubVendors: allBranches,
        };

        // The endpoint answers an empty selection with a 400 whose wording
        // describes a different problem, and a missing target with a 500. Neither
        // is worth showing anyone.
        if (copyBlockedReason(input)) return;

        setIsSubmitting(true);
        const toastId = toast.loading(
            copyAllProducts || productCount > 1
                ? t("copying_products")
                : t("copying_product"),
        );

        try {
            const result = await copyProductsToBranchesReq(input);

            if (!result?.success) {
                toast.error(result?.message || t("copy_failed"), { id: toastId });
                return;
            }

            // A 200 can still mean nothing moved: anything already in the branch
            // is skipped and the count comes back 0.
            const summary = describeCopyResult(result.data, productCount);

            // `t()` has no placeholders, so the counts are composed around the
            // words rather than substituted into them.
            const copiedPhrase = [
                summary.copied,
                summary.copied === 1 ? t("item") : t("items"),
                t("copied_to_branches"),
                summary.targets,
                summary.targets === 1 ? t("branch") : t("branches"),
            ].join(" ");

            if (summary.tone === "success") {
                toast.success(copiedPhrase, { id: toastId });
            } else if (summary.tone === "partial") {
                toast.success(
                    `${copiedPhrase} — ${t("rest_already_in_branches")}`,
                    { id: toastId },
                );
            } else {
                toast.info(t("copy_nothing_new"), { id: toastId });
            }

            if (summary.copied > 0) onCopied?.();
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <TitleHeader
                        title={t("copy_to_branch")}
                        subtitle={
                            copyAllProducts
                                ? t("all_products_will_be_copied")
                                : productCount > 1
                                    ? `${productCount} ${t("products_selected")}`
                                    : t("select_a_branch_to_copy_this_product")
                        }
                    />
                </DialogHeader>

                <div className="px-6 pb-2">
                    {branches?.length === 0 ? (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            {t("no_branches_found")}
                        </div>
                    ) : eligible.length === 0 ? (
                        // Branches exist but none can receive anything. Saying so is
                        // the whole point: the copy would otherwise "succeed" with
                        // nothing copied.
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            {t("no_approved_branches")}
                        </div>
                    ) : (
                        <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
                            {eligible.length > 1 && (
                                <button
                                    type="button"
                                    onClick={toggleAllBranches}
                                    className={cn(
                                        "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                                        allBranches
                                            ? "border-[#DC3173] bg-[#DC3173]/5"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                            allBranches
                                                ? "bg-[#DC3173]/10 text-[#DC3173]"
                                                : "bg-gray-100 text-gray-500",
                                        )}
                                    >
                                        <Store className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900">
                                            {t("all_branches")}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {eligible.length}{" "}
                                            {t("approved_branches")}
                                        </p>
                                    </div>

                                    {allBranches && (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DC3173] text-white">
                                            <Check className="h-3.5 w-3.5" />
                                        </div>
                                    )}
                                </button>
                            )}

                            {eligible.map((branch) => {
                                const targetId = branchTargetId(branch);
                                const isSelected =
                                    allBranches || selectedTargetIds.includes(targetId);

                                return (
                                    <button
                                        key={targetId}
                                        type="button"
                                        onClick={() => toggleTarget(targetId)}
                                        className={cn(
                                            "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                                            isSelected
                                                ? "border-[#DC3173] bg-[#DC3173]/5"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                                            allBranches && "opacity-60",
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                                isSelected
                                                    ? "bg-[#DC3173]/10 text-[#DC3173]"
                                                    : "bg-gray-100 text-gray-500",
                                            )}
                                        >
                                            <Building2 className="h-5 w-5" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-gray-900 truncate">
                                                {branchDisplayName(branch, t("branch"))}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {t("id")}: {branch.userId}
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

                            {/* Shown, never selectable: a customer who cannot see their
                                pending branch here would reasonably think it was lost. */}
                            {ineligible.map((branch) => (
                                <div
                                    key={branch.userId}
                                    className="w-full flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 opacity-60"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                                        <Building2 className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-700 truncate">
                                            {branchDisplayName(branch, t("branch"))}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {t("branch_not_approved")}
                                        </p>
                                    </div>

                                    <BranchStatusBadge status={branch.status} />
                                </div>
                            ))}
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
                        {t("cancel")}
                    </Button>

                    <Button
                        type="button"
                        disabled={targetCount === 0 || !hasProducts || isSubmitting}
                        onClick={handleSubmit}
                        className="bg-[#DC3173] hover:bg-[#c71d62] text-white min-w-[120px]"
                    >
                        {isSubmitting
                            ? t("copying")
                            : targetCount > 1
                                ? `${t("copy_product")} (${targetCount})`
                                : t("copy_product")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
