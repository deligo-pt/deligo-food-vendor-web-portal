"use client";

import { ProfileSection } from "@/src/components/Profile/ProfileSection";
import { useTranslation } from "@/src/hooks/use-translation";
import { IAgreement } from "@/src/types/agreement.type";
import { TMeta } from "@/src/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
    FileCheckIcon,
    DownloadIcon,
    ExternalLinkIcon,
    ClockIcon,
    CheckCircle2Icon,
    BuildingIcon,
    CreditCardIcon,
} from "lucide-react";
import PaginationComponent from "../Filtering/PaginationComponent";

interface IAgreementsProps {
    agreementsData: {
        data: IAgreement[];
        meta: TMeta;
    };
}

export default function AgreementHistory({ agreementsData }: IAgreementsProps) {
    const { t } = useTranslation();
    const { data: agreements = [], meta } = agreementsData || {};

    const getStatusBadge = (status: IAgreement["status"]) => {
        switch (status) {
            case "SIGNED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2Icon className="w-3.5 h-3.5 text-emerald-600" />
                        {t("signed") || "Fully Signed"}
                    </span>
                );
            case "PARTY_SIGNED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        <ClockIcon className="w-3.5 h-3.5 text-amber-600" />
                        {t("party_signed") || "Party Signed"}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {status}
                    </span>
                );
        }
    };

    return (
        <ProfileSection
            title={t("agreement_history")}
            icon={FileCheckIcon}
            delay={0.4}
        >
            {agreements.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">
                    {t("no_agreements_found")}
                </div>
            ) : (
                <div className="space-y-4">
                    {agreements.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-5 rounded-2xl bg-gray-50/80 hover:bg-gray-50 border border-gray-100 transition-all duration-200"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/60">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900 text-base">
                                            {item.commercialName || item.partyLegalName}
                                        </span>
                                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                                            {item.agreementType}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <BuildingIcon className="w-3.5 h-3.5" />
                                        {item.headOfficeAddress}, {item.zipCode}, {item.country}
                                    </p>
                                </div>
                                <div>{getStatusBadge(item.status)}</div>
                            </div>

                            {/* Details & Metadata Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4 text-xs text-gray-600">
                              {item?.partySignatoryType === "AUTHORIZED_REPRESENTATIVE" && <div>
                                    <span className="text-gray-400 block">{t("authorized_representative")}:</span>
                                    <span className="font-medium text-gray-800">
                                        {item.partyRepresentativeName} ({item.partyRepresentativeRole})
                                    </span>
                                </div>}
                                <div>
                                    <span className="text-gray-400 block">{t("nif") || "NIF"}:</span>
                                    <span className="font-medium text-gray-800">{item.nif}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block">{t("payment_option") || "Payment Option"}:</span>
                                    <span className="font-medium text-gray-800 flex items-center gap-1 mt-0.5">
                                        <CreditCardIcon className="w-3 h-3 text-[#DC3173]" />
                                        {item.posPaymentOption === "MONTHLY_RENTAL" ? "Monthly" : "Three Installments"}
                                    </span>
                                </div>
                                {item.signedAt && (
                                    <div>
                                        <span className="text-gray-400 block">{t("signed_at") || "Party Signed At"}:</span>
                                        <span className="font-medium text-gray-800">
                                            {format(new Date(item.signedAt), "dd MMM yyyy, hh:mm a")}
                                        </span>
                                    </div>
                                )}
                                {item.deligoSignedAt && (
                                    <div>
                                        <span className="text-gray-400 block">{t("deligo_signed_at") || "Deligo Signed At"}:</span>
                                        <span className="font-medium text-gray-800">
                                            {format(new Date(item.deligoSignedAt), "dd MMM yyyy, hh:mm a")}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions Footer */}
                            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                                {item.draftPdfPath && (
                                    <a
                                        href={item.draftPdfPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <ExternalLinkIcon className="w-3.5 h-3.5" />
                                        {t("view_draft") || "Draft PDF"}
                                    </a>
                                )}
                                {item.signedPdfPath && (
                                    <a
                                        href={item.signedPdfPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#DC3173] hover:bg-[#c22762] transition-colors shadow-xs"
                                    >
                                        <DownloadIcon className="w-3.5 h-3.5" />
                                        {t("signed_pdf") || "Signed Document"}
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* Pagination Component */}
                    {Boolean(meta?.totalPage && meta.totalPage > 1) && (
                        <div className="pt-6">
                            <PaginationComponent totalPages={meta.totalPage} />
                        </div>
                    )}
                </div>
            )}
        </ProfileSection>
    );
}