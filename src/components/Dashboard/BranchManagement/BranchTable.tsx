"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar";
import {
    MobileRowCard,
    MobileRowCards,
    MobileRowEmpty,
    TABLE_FROM,
} from "@/src/components/MobileRowCard/MobileRowCard";
import { useTranslation } from "@/src/hooks/use-translation";
import { TVendor } from "@/src/types/vendor.type";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
    Building2Icon,
    CalendarIcon,
    CheckCircleIcon,
    Cog,
    EyeIcon,
    HashIcon,
    MailIcon,
    MapPinIcon,
    UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps {
    branches: TVendor[];
}

export default function BranchTable({ branches }: IProps) {
    const { t } = useTranslation();
    const router = useRouter();

    // Helper to format manager/vendor full name
    const getFullName = (nameObj?: { firstName?: string; lastName?: string }) => {
        const firstName = nameObj?.firstName?.trim();
        const lastName = nameObj?.lastName?.trim();

        if (firstName || lastName) {
            return `${firstName || ""} ${lastName || ""}`.trim();
        }
        return "N/A";
    };

    // Helper to format address line safely
    const formatAddress = (location?: { street?: string; city?: string }) => {
        const parts = [location?.street, location?.city].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : null;
    };

    const statusBadge = (status?: string) => (
        <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : status === "PENDING"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
        >
            {status || "UNKNOWN"}
        </span>
    );

    const openBranch = (branch: TVendor) =>
        router.push(`/vendor/branches/${branch.userId}`);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-2 overflow-x-auto"
        >
            {/* Phones and tablets: a card per branch (the table's cells never wrap). */}
            <MobileRowCards until="xl">
                {!branches || branches.length === 0 ? (
                    <MobileRowEmpty>{t("no_branches_found") || "No branches found"}</MobileRowEmpty>
                ) : (
                    branches.map((branch) => (
                        <MobileRowCard
                            key={branch?.userId}
                            leading={
                                <Avatar>
                                    <AvatarImage src={branch.profilePhoto || ""} />
                                    <AvatarFallback className="bg-[#DC3173]/10 text-[#DC3173] font-semibold">
                                        {branch?.name?.firstName?.charAt(0) ||
                                            branch?.businessDetails?.businessName?.charAt(0) ||
                                            "B"}
                                    </AvatarFallback>
                                </Avatar>
                            }
                            title={branch?.businessDetails?.branchName || "N/A"}
                            subtitle={formatAddress(branch?.businessLocation)}
                            aside={statusBadge(branch.status)}
                            fields={[
                                { label: t("user_id") || "User ID", value: branch.userId || "—" },
                                { label: t("manager"), value: getFullName(branch?.name) },
                                { label: t("email") || "Email", value: branch.email || "—" },
                                {
                                    label: t("created_at") || "Created At",
                                    value: branch.createdAt
                                        ? format(new Date(branch.createdAt), "dd-MM-yyyy")
                                        : "—",
                                },
                            ]}
                            actions={
                                <Button
                                    onClick={() => openBranch(branch)}
                                    size="sm"
                                    className="bg-[#DC3173] flex items-center gap-2 hover:bg-[#DC3173]/90"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                    {t("view") || "View"}
                                </Button>
                            }
                        />
                    ))
                )}
            </MobileRowCards>

            <div className={TABLE_FROM.xl}>
            <Table className="max-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <HashIcon className="w-4" />
                                {t("user_id") || "User ID"}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <Building2Icon className="w-4" />
                                {t("branch_name") || "Branch Name"}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <UserIcon className="w-4" />
                                {t("manager")}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <MailIcon className="w-4" />
                                {t("email") || "Email"}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <CalendarIcon className="w-4" />
                                {t("created_at") || "Created At"}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <CheckCircleIcon className="w-4" />
                                {t("status") || "Status"}
                            </div>
                        </TableHead>
                        <TableHead className="text-right">
                            <div className="text-[#DC3173] flex gap-2 items-center justify-end">
                                <Cog className="w-4" />
                                {t("actions") || "Actions"}
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {!branches || branches.length === 0 ? (
                        <TableRow>
                            <TableCell
                                className="text-[#DC3173] text-lg text-center"
                                colSpan={7}
                            >
                                {t("no_branches_found") || "No branches found"}
                            </TableCell>
                        </TableRow>
                    ) : (
                        branches.map((branch) => {
                            const fullName = getFullName(branch?.name);
                            const branchTitle = branch?.businessDetails?.branchName || "N/A";
                            const formattedAddress = formatAddress(branch?.businessLocation);

                            return (
                                <TableRow key={branch?.userId}>
                                    {/* User ID */}
                                    <TableCell className="font-medium">
                                        {branch.userId || "—"}
                                    </TableCell>

                                    {/* Branch Name & Address */}
                                    <TableCell className="whitespace-normal wrap-anywhere min-w-[10rem]">
                                        <div>
                                            <div className="font-semibold">{branchTitle}</div>
                                            {formattedAddress && (
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <MapPinIcon className="w-3 h-3 shrink-0 text-slate-400" />
                                                    {formattedAddress}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Manager Avatar & Name */}
                                    <TableCell className="whitespace-normal wrap-anywhere min-w-[10rem]">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={branch.profilePhoto || ""} />
                                                <AvatarFallback className="bg-[#DC3173]/10 text-[#DC3173] font-semibold">
                                                    {branch?.name?.firstName?.charAt(0) ||
                                                        branch?.businessDetails?.businessName?.charAt(0) ||
                                                        "B"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{fullName}</span>
                                        </div>
                                    </TableCell>

                                    {/* Email */}
                                    <TableCell className="whitespace-normal wrap-anywhere min-w-[10rem]">{branch.email || "—"}</TableCell>

                                    {/* Creation Date */}
                                    <TableCell>
                                        {branch.createdAt
                                            ? format(new Date(branch.createdAt), "dd-MM-yyyy")
                                            : "—"}
                                    </TableCell>

                                    {/* Status Badge */}
                                    <TableCell>
                                        {statusBadge(branch.status)}
                                    </TableCell>

                                    {/* Action Button */}
                                    <TableCell className="text-right">
                                        <Button
                                            onClick={() => openBranch(branch)}
                                            size="sm"
                                            className="bg-[#DC3173] flex items-center gap-2 hover:bg-[#DC3173]/90 ml-auto"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            {t("view") || "View"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
            </div>
        </motion.div>
    );
}