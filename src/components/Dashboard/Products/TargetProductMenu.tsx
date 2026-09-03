"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayersIcon,
    CheckIcon,
    Loader2Icon,
    UtensilsIcon,
    AlertCircleIcon,
} from "lucide-react";

import { useTranslation } from "@/src/hooks/use-translation";
import { IMenu, IMenuSection } from "@/src/types/menu.type";
import { getAllMenuSection } from "@/src/services/dashboard/menu/menu.service";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IProps {
    menus: IMenu[];
    selectedSectionId: string;
    setSelectedSectionId: (id: string) => void;
}

const TargetProductMenu = ({
    menus,
    selectedSectionId,
    setSelectedSectionId,
}: IProps) => {
    const { t, lang } = useTranslation();
    const currentLang = (lang as "en" | "pt") || "en";

    const [selectedMenuId, setSelectedMenuId] = useState<string>("");
    const [sections, setSections] = useState<IMenuSection[]>([]);
    const [isLoadingSections, setIsLoadingSections] = useState<boolean>(false);

    // Fetch sections dynamically when menuId changes
    useEffect(() => {
        if (!selectedMenuId) return;

        const fetchSections = async () => {
            setIsLoadingSections(true);
            setSelectedSectionId("");

            const res = await getAllMenuSection(selectedMenuId);

            if (res?.success && Array.isArray(res?.data)) {
                setSections(res.data);
            } else if (res?.data?.sections && Array.isArray(res.data.sections)) {
                setSections(res.data.sections);
            } else {
                setSections([]);
            }
            setIsLoadingSections(false);
        };

        fetchSections();
    }, [selectedMenuId, setSelectedSectionId]);

    const handleSelectSection = (sectionId: string) => {
        setSelectedSectionId(sectionId);
    };

    const handleSelectMenu = (menuId: string) => {
        setSelectedMenuId(menuId);
        setSections([]);
        setSelectedSectionId("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-2xl"
        >
            {/* Header */}
            <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <UtensilsIcon className="w-5 h-5 text-[#DC3173]" />
                    {t("select_menu_and_section") || "Menu & Section Placement"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    {t("target_menu_desc") ||
                        "Choose which menu and section this product will belong to."}
                </p>
            </div>

            <div className="space-y-5">
                {/* Menu Dropdown Selection (Shadcn UI) */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        {t("select_menu") || "Target Menu"}
                    </label>
                    <Select value={selectedMenuId} onValueChange={handleSelectMenu}>
                        <SelectTrigger className="w-full h-11 bg-white border-slate-200 text-slate-800 focus:ring-2 focus:ring-[#DC3173]/20 focus:border-[#DC3173] text-xs sm:text-sm rounded-lg transition-all">
                            <SelectValue
                                placeholder={t("choose_a_menu") || "-- Select Menu --"}
                            />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 shadow-lg rounded-lg">
                            {menus?.map((menu) => {
                                const menuName =
                                    menu.name?.[currentLang] || menu.name?.en || "Unnamed Menu";
                                return (
                                    <SelectItem
                                        key={menu._id}
                                        value={menu._id}
                                        className="text-xs sm:text-sm font-medium focus:bg-[#DC3173]/10 focus:text-[#DC3173] cursor-pointer py-2.5"
                                    >
                                        {menuName}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Section Selection List */}
                <AnimatePresence mode="wait">
                    {selectedMenuId && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2.5 pt-2"
                        >
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase flex items-center gap-2">
                                    <span>{t("select_section") || "Target Section"}</span>
                                </label>
                                {isLoadingSections && (
                                    <span className="flex items-center gap-1.5 text-xs text-[#DC3173] font-medium">
                                        <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                                        {t("loading") || "Loading..."}
                                    </span>
                                )}
                            </div>

                            {isLoadingSections ? (
                                <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50 flex flex-col items-center justify-center gap-2">
                                    <Loader2Icon className="w-6 h-6 animate-spin text-[#DC3173]" />
                                    <p className="text-xs font-medium text-slate-500">
                                        {t("fetching_menu_sections") || "Fetching menu sections..."}
                                    </p>
                                </div>
                            ) : sections.length === 0 ? (
                                <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50 flex flex-col items-center justify-center gap-2">
                                    <AlertCircleIcon className="w-6 h-6 text-slate-400" />
                                    <p className="text-xs font-medium text-slate-500">
                                        {t("no_sections_found") ||
                                            "No sections available in this menu."}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                                    {sections.map((section) => {
                                        const sectionName =
                                            section.name?.[currentLang] ||
                                            section.name?.en ||
                                            "Section";
                                        const isSelected = selectedSectionId === section._id;

                                        return (
                                            <div
                                                key={section._id}
                                                onClick={() => handleSelectSection(section._id)}
                                                className={`group relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 select-none ${isSelected
                                                        ? "bg-[#DC3173]/5 border-[#DC3173] shadow-sm ring-1 ring-[#DC3173]"
                                                        : "bg-white border-slate-200 hover:border-[#DC3173]/40 hover:bg-slate-50/60"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected
                                                                ? "bg-[#DC3173] text-white"
                                                                : "bg-slate-100 text-slate-500 group-hover:text-[#DC3173] group-hover:bg-[#DC3173]/10"
                                                            }`}
                                                    >
                                                        <LayersIcon className="w-4 h-4" />
                                                    </div>
                                                    <span
                                                        className={`text-xs sm:text-sm truncate transition-colors ${isSelected
                                                                ? "text-[#DC3173] font-semibold"
                                                                : "text-slate-700 font-medium group-hover:text-slate-900"
                                                            }`}
                                                    >
                                                        {sectionName}
                                                    </span>
                                                </div>

                                                <div
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${isSelected
                                                            ? "bg-[#DC3173] border-[#DC3173] text-white scale-100"
                                                            : "border-slate-300 bg-white group-hover:border-[#DC3173]"
                                                        }`}
                                                >
                                                    {isSelected && <CheckIcon className="w-3 h-3 stroke-3" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default TargetProductMenu;