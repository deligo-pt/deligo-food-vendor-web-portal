"use client";

import { motion } from "framer-motion";
import {
    ArrowLeftCircle,
    CalendarIcon,
    CheckCircle2Icon,
    ClockIcon,
    Edit2,
    LayersIcon,
    XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/src/hooks/use-translation";
import { IMenu } from "@/src/types/menu.type";
import { useRouter } from "next/navigation";
import TitleHeader from "../../TitleHeader/TitleHeader";

export default function MenuDetails({ menu }: { menu: IMenu }) {
    const { t, lang } = useTranslation();
    const router = useRouter();

    if (!menu) {
        return (
            <div className="p-6 text-center text-[#DC3173]">
                {t("menu_not_found") || "Menu not found."}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Header & Navigation */}
            <Button
                onClick={() => router.back()}
                variant="link"
                className="inline-flex items-center text-sm gap-2 text-[#DC3173] px-0! py-0 h-4 cursor-pointer"
            >
                <ArrowLeftCircle /> {t("goBack")}
            </Button>
            <TitleHeader
                title={t("all_menus")}
                subtitle={t("menus_that_are_created")}
                buttonInfo={{
                    text: t("edit_menu"),
                    icon: Edit2,
                    onClick: () => router.push(`/vendor/menu/edit/${menu?._id}`),
                }}
            />

            {/* Main Content Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Left Column: Localized Details */}
                <div className="lg:col-span-2 bg-white shadow-md rounded-2xl p-6 border border-slate-100">
                    {/* Localized Content Display */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                {t("menu_name") || "Menu Name"}
                            </label>
                            <h2 className="text-2xl font-bold text-slate-800 mt-1">
                                {menu?.name?.[lang] || "—"}
                            </h2>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                {t("description") || "Description"}
                            </label>
                            <p className="text-slate-600 mt-1 leading-relaxed">
                                {menu?.description?.[lang] || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Metadata & Availability Cards */}
                <div className="space-y-6">
                    {/* Status & Settings Card */}
                    <div className="bg-white shadow-md rounded-2xl p-6 border border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 border-b pb-3">
                            {t("settings") || "Settings"}
                        </h3>

                        {/* Active Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-sm">{t("status")}</span>
                            {menu.isActive ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle2Icon className="w-3.5 h-3.5" />
                                    {t("active") || "Active"}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <XCircleIcon className="w-3.5 h-3.5" />
                                    {t("inactive") || "Inactive"}
                                </span>
                            )}
                        </div>

                        {/* Sort Order */}
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-sm flex items-center gap-2">
                                <LayersIcon className="w-4 h-4 text-[#DC3173]" />
                                {t("sort_order") || "Sort Order"}
                            </span>
                            <span className="font-semibold text-slate-800">
                                {menu.sortOrder}
                            </span>
                        </div>
                    </div>

                    {/* Availability Card */}
                    <div className="bg-white shadow-md rounded-2xl p-6 border border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800 border-b pb-3">
                            {t("availability") || "Availability"}
                        </h3>

                        {/* Operating Hours */}
                        <div className="flex items-start gap-3">
                            <ClockIcon className="w-5 h-5 text-[#DC3173] mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-400 font-semibold uppercase">
                                    {t("hours") || "Hours"}
                                </p>
                                <p className="font-medium text-slate-800 mt-0.5">
                                    {menu.availability?.startTime} – {menu.availability?.endTime}
                                </p>
                            </div>
                        </div>

                        {/* Active Days */}
                        <div className="flex items-start gap-3 pt-2">
                            <CalendarIcon className="w-5 h-5 text-[#DC3173] mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-400 font-semibold uppercase">
                                    {t("days") || "Days"}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {menu.availability?.daysOfWeek?.map((day) => (
                                        <span
                                            key={day}
                                            className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700"
                                        >
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}