"use client";

import ProfileDoc from "@/src/components/Profile/ProfileDoc";
import { ProfileInfoRow } from "@/src/components/Profile/ProfileInfoRow";
import ProfilePhotoUpload from "@/src/components/Profile/ProfilePhotoUpload";
import { ProfileSection } from "@/src/components/Profile/ProfileSection";
import { USER_STATUS } from "@/src/consts/user.const";
import { TVendor } from "@/src/types/vendor.type";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  Building2Icon,
  BuildingIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  DoorClosedIcon,
  DoorOpenIcon,
  FileTextIcon,
  HashIcon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  NetworkIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";

export default function Profile({ vendor }: { vendor: TVendor }) {
  const getStatusColor = (status: keyof typeof USER_STATUS) => {
    const colors = {
      APPROVED: "bg-green-100 text-green-700 border-green-200",
      SUBMITTED: "bg-gray-100 text-gray-700 border-gray-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[status];
  };

  console.log(vendor.lastLoginAt!);

  const accountAge = Math.floor(
    (new Date().getTime() - new Date(vendor.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header with gradient */}
      <div className="relative bg-linear-to-r from-[#DC3173] to-[#FF6B9D] h-48 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="px-4 md:px-6 -mt-20 pb-12">
        {/* Profile Header Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 relative"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            <ProfilePhotoUpload currentPhoto={vendor.profilePhoto} />

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {vendor.name?.firstName} {vendor.name?.lastName}
                </h1>
                <motion.span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    vendor.status
                  )}`}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  {vendor.status}
                </motion.span>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MailIcon className="w-4 h-4" />
                  <span>{vendor.email}</span>
                </div>
                {vendor.isEmailVerified && (
                  <div className="flex items-center gap-1 text-[#DC3173]">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                {vendor.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <StarIcon className="w-5 h-5 fill-current" />
                      <span className="text-lg font-bold text-gray-900">
                        {vendor.rating.average}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({vendor.rating.totalReviews} reviews)
                    </span>
                  </div>
                )}
                {vendor.totalOrders ? (
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon className="w-5 h-5 text-[#DC3173]" />
                    <span className="text-lg font-bold text-gray-900">
                      {vendor.totalOrders}
                    </span>
                    <span className="text-sm text-gray-500">orders</span>
                  </div>
                ) : (
                  ""
                )}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#DC3173]" />
                  <span className="text-lg font-bold text-gray-900">
                    {accountAge}
                  </span>
                  <span className="text-sm text-gray-500">days active</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <ProfileSection
            title="Personal Information"
            icon={UserIcon}
            delay={0.1}
          >
            <div className="space-y-1">
              <ProfileInfoRow
                label="Phone Number"
                value={vendor.contactNumber}
                icon={PhoneIcon}
              />
              <ProfileInfoRow
                label="Email"
                value={vendor.email}
                icon={MailIcon}
              />
            </div>
          </ProfileSection>

          {/* Business Details */}
          <ProfileSection
            title="Business Details"
            icon={BuildingIcon}
            delay={0.15}
          >
            <div className="space-y-1">
              <ProfileInfoRow
                label="Business Name"
                value={vendor.businessDetails?.businessName}
                icon={BriefcaseIcon}
              />
              <ProfileInfoRow
                label="Business Type"
                value={vendor.businessDetails?.businessType}
                icon={Building2Icon}
              />
              <ProfileInfoRow
                label="License Number"
                value={vendor.businessDetails?.businessLicenseNumber}
                icon={HashIcon}
              />
              <ProfileInfoRow
                label="NIF"
                value={vendor.businessDetails?.NIF}
                icon={BuildingIcon}
              />
              <ProfileInfoRow
                label="Number of Branches"
                value={vendor.businessDetails?.totalBranches}
                icon={NetworkIcon}
              />
              <ProfileInfoRow
                label="Opening Hours"
                value={vendor.businessDetails?.openingHours}
                icon={DoorOpenIcon}
              />
              <ProfileInfoRow
                label="Closing Hours"
                value={vendor.businessDetails?.closingHours}
                icon={DoorClosedIcon}
              />
              {vendor.businessDetails?.closingDays && (
                <ProfileInfoRow
                  label="Closing Days"
                  value={vendor.businessDetails.closingDays.join(", ")}
                  icon={CalendarDaysIcon}
                />
              )}
            </div>
          </ProfileSection>

          {/* Business Location */}
          <ProfileSection
            title="Business Location"
            icon={MapPinIcon}
            delay={0.2}
          >
            <div className="space-y-1">
              <ProfileInfoRow
                label="Street Address"
                value={`${vendor.businessLocation?.streetNumber} ${vendor.businessLocation?.streetAddress}`}
                icon={MapIcon}
              />
              <ProfileInfoRow
                label="City"
                value={vendor.businessLocation?.city}
                icon={Building2Icon}
              />
              <ProfileInfoRow
                label="Postal Code"
                value={vendor.businessLocation?.postalCode}
                icon={HashIcon}
              />
            </div>
          </ProfileSection>

          {/* Bank Details */}
          <ProfileSection
            title="Bank Details"
            icon={CreditCardIcon}
            delay={0.25}
          >
            <div className="space-y-1">
              <ProfileInfoRow
                label="Bank Name"
                value={vendor.bankDetails?.bankName}
                icon={Building2Icon}
              />
              <ProfileInfoRow
                label="Account Holder"
                value={vendor.bankDetails?.accountHolderName}
                icon={UserIcon}
              />
              <ProfileInfoRow
                label="IBAN"
                value={vendor.bankDetails?.iban.replace(/(.{4})/g, "$1 ")}
                icon={CreditCardIcon}
              />
              <ProfileInfoRow
                label="SWIFT Code"
                value={vendor.bankDetails?.swiftCode}
                icon={HashIcon}
              />
            </div>
          </ProfileSection>

          {/* Documents */}
          <ProfileSection title="Documents" icon={FileTextIcon} delay={0.3}>
            <ProfileDoc documents={vendor?.documents} />
          </ProfileSection>

          {/* Activity */}
          <ProfileSection
            title="Account Activity"
            icon={ClockIcon}
            delay={0.35}
          >
            <div className="space-y-1">
              {vendor.lastLoginAt && (
                <ProfileInfoRow
                  label="Last Login"
                  value={format(
                    vendor.lastLoginAt,
                    "hh:mm aa, do MMM yyyy"
                  ).toLocaleString()}
                  icon={ClockIcon}
                />
              )}
              <ProfileInfoRow
                label="Account Created"
                value={format(vendor.createdAt, "do MMM yyyy")}
                icon={CalendarIcon}
              />
              <ProfileInfoRow
                label="Two-Factor Auth"
                value={vendor.twoFactorEnabled ? "Enabled" : "Disabled"}
                icon={ShieldCheckIcon}
              />
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}
