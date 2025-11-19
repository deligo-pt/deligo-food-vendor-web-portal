"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  HandHeart,
  Lock,
  ClipboardList,
  Eye,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0px 8px 24px rgba(0,0,0,0.06)";

export default function VendorSafetyPage() {
  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Safety & Compliance
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Ensure your restaurant meets Deligo&apos;s safety, hygiene and food handling standards.
            </p>
          </div>

          <ShieldCheck size={48} className="text-pink-600" />
        </div>

        {/* SAFETY SUMMARY */}
        <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-bold text-xl" style={{ color: PRIMARY }}>Your Compliance Status</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <ShieldCheck size={40} className="mx-auto text-green-600" />
                <p className="font-semibold text-gray-700 mt-2">Verified</p>
                <p className="text-xs text-gray-500">Account Status</p>
              </div>

              <div>
                <FileCheck2 size={40} className="mx-auto text-blue-600" />
                <p className="font-semibold text-gray-700 mt-2">Up to Date</p>
                <p className="text-xs text-gray-500">Documents</p>
              </div>

              <div>
                <HandHeart size={40} className="mx-auto text-pink-600" />
                <p className="font-semibold text-gray-700 mt-2">Excellent</p>
                <p className="text-xs text-gray-500">Hygiene Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* SAFETY SECTIONS */}
        <div className="space-y-8">

          {/* FOOD HANDLING POLICIES */}
          <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ClipboardList size={28} className="text-pink-600" />
                <h2 className="font-bold text-lg" style={{ color: PRIMARY }}>Food Handling Policies</h2>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 ml-2">
                <li>• Store food items at correct temperatures</li>
                <li>• Use sealed containers for deliveries</li>
                <li>• Follow Portugal HACCP guidelines</li>
                <li>• Keep work surfaces sanitized regularly</li>
              </ul>
            </CardContent>
          </Card>

          {/* STAFF SAFETY TRAINING */}
          <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={28} className="text-amber-600" />
                <h2 className="font-bold text-lg" style={{ color: PRIMARY }}>Staff Safety Training</h2>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 ml-2">
                <li>• Mandatory hygiene training for all kitchen staff</li>
                <li>• Gloves and masks required during food prep</li>
                <li>• Delivery handoff must be contact-safe</li>
                <li>• Maintain a clean, uniform appearance</li>
              </ul>
            </CardContent>
          </Card>

          {/* DATA & PRIVACY */}
          <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Lock size={28} className="text-blue-600" />
                <h2 className="font-bold text-lg" style={{ color: PRIMARY }}>Data Privacy & Security</h2>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 ml-2">
                <li>• Customer data must NOT be shared</li>
                <li>• Payment data is encrypted (PSD2 compliant)</li>
                <li>• Reporting suspicious activities is mandatory</li>
              </ul>
            </CardContent>
          </Card>

          {/* DELIVERY SAFETY */}
          <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Eye size={28} className="text-purple-600" />
                <h2 className="font-bold text-lg" style={{ color: PRIMARY }}>Delivery Safety</h2>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 ml-2">
                <li>• Verify rider identity before handover</li>
                <li>• Ensure package is sealed properly</li>
                <li>• Use tamper-proof bags</li>
                <li>• Check for correct rider assignment</li>
              </ul>
            </CardContent>
          </Card>

        </div>

        {/* CTA */}
        <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-6 text-center space-y-3">
            <HandHeart size={40} className="mx-auto text-pink-600" />
            <h2 className="font-bold text-xl">Need help with safety compliance?</h2>
            <p className="text-sm text-gray-600 max-w-[450px] mx-auto">
              Our support team can guide you through Portugal&#39;s safety rules for restaurants.
            </p>
            <Button className="h-11 px-6 text-white rounded-xl" style={{ background: PRIMARY }}>
              Contact Safety Support
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
