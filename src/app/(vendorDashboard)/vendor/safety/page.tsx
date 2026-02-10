"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import {
  AlertTriangle,
  ClipboardList,
  Eye,
  FileCheck2,
  HandHeart,
  Lock,
  ShieldCheck,
} from "lucide-react";

const PRIMARY = "#DC3173";
const SHADOW = "0px 8px 24px rgba(0,0,0,0.06)";

export default function VendorSafetyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-6 space-y-10">
      {/* HEADER */}
      <TitleHeader
        title={t("safety_compliance")}
        subtitle={t("ensure_restaurant_meets")}
      />

      {/* SAFETY SUMMARY */}
      <Card
        className="rounded-3xl bg-white border shadow-md"
        style={{ boxShadow: SHADOW }}
      >
        <CardContent className="p-6 space-y-4">
          <h2 className="font-bold text-xl" style={{ color: PRIMARY }}>
            {t("compliance_status")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <ShieldCheck size={40} className="mx-auto text-green-600" />
              <p className="font-semibold text-gray-700 mt-2">
                {t("verified")}
              </p>
              <p className="text-xs text-gray-500">{t("account_status")}</p>
            </div>

            <div>
              <FileCheck2 size={40} className="mx-auto text-blue-600" />
              <p className="font-semibold text-gray-700 mt-2">
                {t("up_to_date")}
              </p>
              <p className="text-xs text-gray-500">{t("documents")}</p>
            </div>

            <div>
              <HandHeart size={40} className="mx-auto text-pink-600" />
              <p className="font-semibold text-gray-700 mt-2">
                {t("excellent")}
              </p>
              <p className="text-xs text-gray-500">{t("hygine_rating")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* SAFETY SECTIONS */}
      <div className="space-y-8">
        {/* FOOD HANDLING POLICIES */}
        <Card
          className="rounded-3xl bg-white border shadow-md"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <ClipboardList size={28} className="text-pink-600" />
              <h2 className="font-bold text-lg" style={{ color: PRIMARY }}>
                {t("food_handling_policies")}
              </h2>
            </div>
            <ul className="text-sm text-gray-700 space-y-2 ml-2">
              <li>• {t("store_food_items_correct_temperatures")}</li>
              <li>• {t("use_sealed_containers")}</li>
              <li>• {t("follow_portugal_haccp_guidelines")}</li>
              <li>• {t("keep_work_surfaces_sanitized")}</li>
            </ul>
          </CardContent>
        </Card>

        {/* STAFF SAFETY TRAINING */}
        <Card
          className="rounded-3xl bg-white border shadow-md"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={28} className="text-amber-600" />
              <h2 className="font-bold text-lg" style={{ color: PRIMARY }}>
                {t("staff_safety_training")}
              </h2>
            </div>
            <ul className="text-sm text-gray-700 space-y-2 ml-2">
              <li>• {t("mandatory_hygine_training")}</li>
              <li>• {t("gloves_and_masks_required")}</li>
              <li>• {t("delivery_handoff_must_contact_safe")}</li>
              <li>• {t("maintain_clean_uniform")}</li>
            </ul>
          </CardContent>
        </Card>

        {/* DATA & PRIVACY */}
        <Card
          className="rounded-3xl bg-white border shadow-md"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Lock size={28} className="text-blue-600" />
              <h2 className="font-bold text-lg" style={{ color: PRIMARY }}>
                {t("data_privacy_security")}
              </h2>
            </div>
            <ul className="text-sm text-gray-700 space-y-2 ml-2">
              <li>• {t("customer_data_must_shared")}</li>
              <li>• {t("payment_data_encrypted")}</li>
              <li>• {t("reporting_suspicious_activities")}</li>
            </ul>
          </CardContent>
        </Card>

        {/* DELIVERY SAFETY */}
        <Card
          className="rounded-3xl bg-white border shadow-md"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Eye size={28} className="text-purple-600" />
              <h2 className="font-bold text-lg" style={{ color: PRIMARY }}>
                {t("delivery_safety")}
              </h2>
            </div>
            <ul className="text-sm text-gray-700 space-y-2 ml-2">
              <li>• {t("verify_rider_identity")}</li>
              <li>• {t("ensure_package_sealed")}</li>
              <li>• {t("use_tamper_proof_bags")}</li>
              <li>• {t("check_correct_rider_assignment")}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card
        className="rounded-3xl bg-white border shadow-md"
        style={{ boxShadow: SHADOW }}
      >
        <CardContent className="p-6 text-center space-y-3">
          <HandHeart size={40} className="mx-auto text-pink-600" />
          <h2 className="font-bold text-xl">
            {t("need_help_safety_compliance")}
          </h2>
          <p className="text-sm text-gray-600 max-w-[450px] mx-auto">
            {t("support_team_guide_through")}
          </p>
          <Button
            className="h-11 px-6 text-white rounded-xl"
            style={{ background: PRIMARY }}
          >
            {t("contact_safety_support")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
