// CategoryDetails.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TProductCategory } from "@/src/types/category.type";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowLeftCircle, Calendar, CheckCircle2, Globe, Hash, ShieldAlert, Tag, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface IProps {
    category: TProductCategory;
}

const CategoryDetails = ({ category }: IProps) => {
    const { t, lang } = useTranslation();
    const router = useRouter();

    if (!category) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <p className="text-slate-500 font-medium">{t("category_not_found") || "Category details not found"}</p>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-[#DC3173] font-semibold hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t("back") || "Go back"}
                </button>
            </div>
        );
    }

    const formatDate = (date?: Date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleString(lang === "pt" ? "pt-PT" : "en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* NAVIGATION HEADER */}
            <Button
                onClick={() => router.back()}
                variant="link"
                className="inline-flex items-center text-sm gap-2 text-[#DC3173] px-0! py-0 h-4 cursor-pointer"
            >
                <ArrowLeftCircle /> {t("goBack")}
            </Button>
            <TitleHeader
                title={category.name?.[lang] || category.name?.en || "Category Details"}
                subtitle={`ID: ${category._id}`}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PRIMARY METRICS & OVERVIEW */}
                <Card className="md:col-span-2 rounded-3xl border bg-white shadow-sm overflow-hidden">
                    <CardHeader className="border-b bg-slate-50/50 px-6 py-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                            <Tag className="w-5 h-5 text-[#DC3173]" />
                            {t("category_information") || "Category Information"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {/* LOCALIZED NAMES */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5" />
                                {t("category_name")}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-400 block mb-1">
                                        English (EN)
                                    </span>
                                    <span className="text-base font-semibold text-slate-800">
                                        {category.name?.en || "N/A"}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-400 block mb-1">
                                        Portuguese (PT)
                                    </span>
                                    <span className="text-base font-semibold text-slate-800">
                                        {category.name?.pt || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* SLUG & IDENTIFIERS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                                <span className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                                    <Hash className="w-3.5 h-3.5" /> Slug
                                </span>
                                <code className="text-sm font-semibold text-[#DC3173] bg-[#DC3173]/5 px-2 py-0.5 rounded-md">
                                    {category.slug}
                                </code>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                                <span className="text-xs font-semibold text-slate-400 block mb-1">
                                    Object ID
                                </span>
                                <code className="text-xs font-mono text-slate-600 break-all">
                                    {category._id}
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* STATUS & TIMESTAMPS */}
                <div className="space-y-6">
                    {/* STATUS CARD */}
                    <Card className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                        <CardHeader className="border-b bg-slate-50/50 px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-slate-800">
                                {t("status") || "Status & Visibility"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="text-sm font-medium text-slate-600">
                                    {t("active_status") || "Active Status"}
                                </span>
                                {category.isActive ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {t("active") || "Active"}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                        <XCircle className="w-3.5 h-3.5" />
                                        {t("inactive") || "Inactive"}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="text-sm font-medium text-slate-600">
                                    {t("delete_status") || "Delete Status"}
                                </span>
                                {category.isDeleted ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                        <ShieldAlert className="w-3.5 h-3.5" />
                                        {t("soft_deleted") || "Soft Deleted"}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                                        {t("false") || "Published"}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* METADATA CARD */}
                    <Card className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                        <CardHeader className="border-b bg-slate-50/50 px-6 py-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                                <Calendar className="w-5 h-5 text-slate-500" />
                                {t("timestamps") || "Timestamps"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4 text-sm">
                            <div>
                                <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                                    {t("created_at") || "Created At"}
                                </span>
                                <span className="font-medium text-slate-700">
                                    {formatDate(category.createdAt)}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                                    {t("last_updated") || "Last Updated"}
                                </span>
                                <span className="font-medium text-slate-700">
                                    {formatDate(category.updatedAt)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

export default CategoryDetails;