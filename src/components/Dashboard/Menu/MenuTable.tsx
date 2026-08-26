"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/src/hooks/use-translation";
import { IMenu } from "@/src/types/menu.type";
import { motion } from "framer-motion";
import {
    BookOpenIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    Cog,
    FileTextIcon,
    LayersIcon,
    MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";

interface IProps {
    menus: IMenu[];
}

export default function MenuTable({ menus }: IProps) {
    const { t, lang } = useTranslation();
    const router = useRouter();

    const getLocalizedText = (textObj?: { en: string; pt: string }) => {
        if (!textObj) return "—";
        const currentLang = (lang as "en" | "pt") || "en";
        return textObj[currentLang] || textObj.en || "—";
    };

    const formatDays = (days?: string[]) => {
        if (!days || days.length === 0) return "—";
        if (days.length === 7) return t("all_days") || "Every day";
        return days.join(", ");
    };

    const formatTimeRange = (startTime?: string, endTime?: string) => {
        if (!startTime || !endTime) return "—";
        return `${startTime} - ${endTime}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-2 overflow-x-auto"
        >
            <Table className="max-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <BookOpenIcon className="w-4 h-4" />
                                {t("name")}
                            </div>
                        </TableHead>

                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <FileTextIcon className="w-4 h-4" />
                                {t("description")}
                            </div>
                        </TableHead>

                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <CalendarIcon className="w-4 h-4" />
                                {t("days")}
                            </div>
                        </TableHead>

                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <ClockIcon className="w-4 h-4" />
                                {t("hours")}
                            </div>
                        </TableHead>

                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <LayersIcon className="w-4 h-4" />
                                {t("sort_order")}
                            </div>
                        </TableHead>

                        <TableHead>
                            <div className="text-[#DC3173] flex gap-2 items-center">
                                <CheckCircleIcon className="w-4 h-4" />
                                {t("status")}
                            </div>
                        </TableHead>

                        <TableHead className="text-right text-[#DC3173] flex gap-2 items-center justify-end">
                            <Cog className="w-4 h-4" />
                            {t("actions")}
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {menus?.length === 0 && (
                        <TableRow>
                            <TableCell
                                className="text-[#DC3173] text-lg text-center"
                                colSpan={7}
                            >
                                {t("no_menus_found")}
                            </TableCell>
                        </TableRow>
                    )}

                    {menus?.map((menu) => (
                        <TableRow key={menu._id}>
                            {/* Menu Name */}
                            <TableCell className="font-medium">
                                {getLocalizedText(menu.name)}
                            </TableCell>

                            {/* Description */}
                            <TableCell className="max-w-xs truncate text-slate-600">
                                {getLocalizedText(menu.description)}
                            </TableCell>

                            {/* Days of Week */}
                            <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                    {formatDays(menu.availability?.daysOfWeek)}
                                </span>
                            </TableCell>

                            {/* Operating Hours */}
                            <TableCell>
                                {formatTimeRange(
                                    menu.availability?.startTime,
                                    menu.availability?.endTime
                                )}
                            </TableCell>

                            {/* Sort Order */}
                            <TableCell>{menu.sortOrder ?? 0}</TableCell>

                            {/* Status Badge */}
                            <TableCell>
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${menu.isActive
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {menu.isActive ? t("active") : t("inactive")}
                                </span>
                            </TableCell>

                            {/* Action Button */}
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => router.push(`/vendor/menu/${menu._id}`)}
                                        >
                                            {t("view")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => router.push(`/vendor/menu/edit/${menu._id}`)}
                                        >
                                            {t("edit")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </motion.div>
    );
}