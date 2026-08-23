"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/src/hooks/use-translation";
import { TVendor } from "@/src/types/vendor.type";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
    ArrowLeftCircle,
    Building2,
    CalendarClock,
    CreditCard,
    Edit,
    FileTextIcon,
    Mail,
    MapPin,
    Package,
    Phone,
    Star,
    Store,
    Utensils,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BranchSection, BranchStatusBadge, InfoRow } from "./BranchHelpers";
import ProfileDoc, { IVendorDocs } from "../../Profile/ProfileDoc";

interface IProps {
    branch: TVendor;
}

export const BranchDetails = ({ branch }: IProps) => {
    const router = useRouter();
    const { t } = useTranslation();

    const fullName =
        `${branch?.name?.firstName || ""} ${branch?.name?.lastName || ""}`.trim() ||
        branch?.businessDetails?.businessName ||
        "No Name Provided";

    const businessName =
        branch?.businessDetails?.businessName || "No Business Name";

    return (
        <div>
            {/* Header actions */}
            <div className="flex flex-row justify-between items-center mb-4">
                <Button
                    onClick={() => router.push("/vendor/branches")}
                    variant="link"
                    className="inline-flex items-center text-sm gap-2 text-[#DC3173] px-0! py-0 h-4 cursor-pointer"
                >
                    <ArrowLeftCircle /> {t("goBack")}
                </Button>

                {(branch?.status === "PENDING" || branch?.status === "REJECTED") && (
                    <Button
                        onClick={() =>
                            router.push(`/vendor/branches/edit/${branch?.userId}`)
                        }
                        variant="link"
                        className="inline-flex items-center text-sm gap-2 text-white bg-[#DC3173] px-4 py-2 cursor-pointer"
                    >
                        <Edit />{" "}
                        {branch?.status === "PENDING"
                            ? t("update_information")
                            : t("re_submit")}
                    </Button>
                )}
            </div>

            {/* Profile header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#DC3173] text-white p-6 rounded-t-lg"
            >
                <div className="flex items-center space-x-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 rounded-full bg-white/20 overflow-hidden flex items-center justify-center"
                    >
                        {branch.profilePhoto ? (
                            <Image
                                src={branch.profilePhoto}
                                alt={fullName}
                                className="w-full h-full object-cover"
                                width={500}
                                height={500}
                            />
                        ) : (
                            <Store className="w-10 h-10 text-white/70" />
                        )}
                    </motion.div>

                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl font-bold"
                        >
                            {businessName}
                        </motion.h2>

                        {fullName !== businessName && (
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-white/80 text-sm"
                            >
                                {fullName}
                            </motion.p>
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center space-x-1 text-white/80 mt-1"
                        >
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{branch.email || "N/A"}</span>
                        </motion.div>

                        {branch?.contactNumber && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center space-x-1 text-white/80"
                            >
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">{branch.contactNumber}</span>
                            </motion.div>
                        )}
                    </div>

                    <div className="flex flex-col justify-end items-end gap-1">
                        <BranchStatusBadge status={branch.status} />
                        {branch?.remarks && (
                            <p className="hidden md:block text-sm">{branch.remarks}</p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Sections */}
            <div className="bg-gray-50 my-4 rounded-b-lg">
                {/* Business Details */}
                <BranchSection
                    title={t("businessDetails")}
                    icon={<Building2 />}
                    defaultOpen={true}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
                        <div>
                            <InfoRow
                                label={t("business_name")}
                                value={branch.businessDetails?.businessName || "N/A"}
                            />
                            <InfoRow
                                label={t("business_type")}
                                value={branch.businessDetails?.businessType || "N/A"}
                            />
                            <InfoRow
                                label={t("cuisine_type")}
                                value={
                                    branch.businessDetails?.restaurantCuisineType?.join(", ") ||
                                    "N/A"
                                }
                            />
                        </div>
                        <div>
                            <InfoRow
                                label={t("nif")}
                                value={branch.businessDetails?.NIF || "N/A"}
                            />
                            <InfoRow
                                label={t("branch_name")}
                                value={branch.businessDetails?.branchName || "N/A"}
                            />
                        </div>
                    </div>
                </BranchSection>

                {/* Opening Hours */}
                <BranchSection title={t("opening_hours")} icon={<Utensils />}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
                        <div>
                            <InfoRow
                                label={t("opening_hours")}
                                value={branch.businessDetails?.openingHours || "N/A"}
                            />
                            <InfoRow
                                label={t("closing_hours")}
                                value={branch.businessDetails?.closingHours || "N/A"}
                            />
                        </div>
                        <div>
                            <InfoRow
                                label={t("closingDays")}
                                value={
                                    branch.businessDetails?.closingDays?.length
                                        ? branch.businessDetails.closingDays.join(", ")
                                        : t("none")
                                }
                            />
                            <InfoRow
                                label={t("store_status")}
                                value={
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs ${branch.businessDetails?.isStoreOpen
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {branch.businessDetails?.isStoreOpen
                                            ? t("open")
                                            : t("closed")}
                                    </span>
                                }
                            />
                        </div>
                    </div>
                </BranchSection>

                {/* Address / Business Location */}
                <BranchSection title={t("business_location")} icon={<MapPin />}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
                        <div>
                            <InfoRow
                                label={t("street")}
                                value={
                                    branch.businessLocation?.street ||
                                    branch.address?.street ||
                                    "N/A"
                                }
                            />
                            <InfoRow
                                label={t("city")}
                                value={
                                    branch.businessLocation?.city || branch.address?.city || "N/A"
                                }
                            />
                        </div>
                        <div>
                            <InfoRow
                                label={t("state")}
                                value={
                                    branch.businessLocation?.state ||
                                    branch.address?.state ||
                                    "N/A"
                                }
                            />
                            <InfoRow
                                label={t("country")}
                                value={
                                    branch.businessLocation?.country ||
                                    branch.address?.country ||
                                    "N/A"
                                }
                            />
                            <InfoRow
                                label={t("zip_code")}
                                value={
                                    branch.businessLocation?.postalCode ||
                                    branch.address?.postalCode ||
                                    "N/A"
                                }
                            />
                        </div>
                    </div>
                </BranchSection>

                {/* Bank Details */}
                <BranchSection title={t("bankDetails")} icon={<CreditCard />}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
                        <div>
                            <InfoRow
                                label={t("accountHolder")}
                                value={branch.bankDetails?.accountHolderName || "N/A"}
                            />
                            <InfoRow
                                label={t("iban")}
                                value={branch.bankDetails?.iban || "N/A"}
                            />
                        </div>
                        <div>
                            {/* Add more bank fields if available in your type */}
                        </div>
                    </div>
                </BranchSection>

                {/* documents */}
                <BranchSection
                    title={t("documents")}
                    icon={<FileTextIcon />}
                >
                    <ProfileDoc documents={branch?.documents as IVendorDocs} />
                </BranchSection>

                {/* Rating & Operational */}
                <BranchSection title={t("operational_data")} icon={<Package />}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                            <div className="text-gray-500 text-xs mb-1">{t("rating")}</div>
                            <div className="text-2xl font-bold text-amber-500 flex items-center justify-center">
                                {branch?.rating?.average?.toFixed(1) || "N/A"}{" "}
                                <Star className="w-4 h-4 ml-1" fill="currentColor" />
                            </div>
                            <div className="text-xs text-gray-500">
                                {branch?.rating?.totalReviews || 0} {t("reviews")}
                            </div>
                        </div>
                    </div>
                </BranchSection>

                {/* Account Information */}
                <BranchSection title={t("account_information")} icon={<CalendarClock />}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
                        <div>
                            <InfoRow
                                label={t("user_id")}
                                value={branch.userId || "N/A"}
                            />
                            <InfoRow
                                label={t("role")}
                                value={branch.role || "N/A"}
                            />
                            <InfoRow
                                label={t("account_created")}
                                value={
                                    branch.createdAt
                                        ? format(new Date(branch.createdAt), "dd/MM/yyyy")
                                        : "N/A"
                                }
                            />
                            <InfoRow
                                label={t("last_updated")}
                                value={
                                    branch.updatedAt
                                        ? format(new Date(branch.updatedAt), "dd/MM/yyyy")
                                        : "N/A"
                                }
                            />
                        </div>
                        <div>
                            <InfoRow
                                label={t("submitted_for_approval")}
                                value={
                                    branch.submittedForApprovalAt
                                        ? format(
                                            new Date(branch.submittedForApprovalAt),
                                            "dd/MM/yyyy"
                                        )
                                        : "N/A"
                                }
                            />
                            <InfoRow
                                label={t("approved_rejected_blocked_at")}
                                value={
                                    branch.approvedOrRejectedOrBlockedAt
                                        ? format(
                                            new Date(branch.approvedOrRejectedOrBlockedAt),
                                            "dd/MM/yyyy"
                                        )
                                        : "N/A"
                                }
                            />
                            {branch.remarks && (
                                <InfoRow label={t("remarks")} value={branch.remarks} />
                            )}
                            <InfoRow
                                label={t("parent_vendor_id")}
                                value={branch.parentVendorId || "N/A"}
                            />
                        </div>
                    </div>
                </BranchSection>
            </div>
        </div>
    );
};

export default BranchDetails;