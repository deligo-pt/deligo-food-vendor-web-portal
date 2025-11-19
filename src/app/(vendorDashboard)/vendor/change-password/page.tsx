"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0px 8px 24px rgba(0,0,0,0.06)";

export default function VendorChangePasswordPage() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const updatePassword = () => {
    if (!oldPass || !newPass || !confirmPass) return;
    if (newPass !== confirmPass) return; // simple check
    setSuccess(true);
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[600px] mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <Lock size={40} className="text-pink-600" />
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Change Password
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Update your account password securely.
            </p>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
            <CheckCircle /> Password updated successfully.
          </div>
        )}

        {/* FORM */}
        <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-6 space-y-6">

            {/* OLD PASSWORD */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Current Password</label>
              <div className="relative">
                <Input
                  type={showOld ? "text" : "password"}
                  placeholder="Enter current password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="h-12 rounded-xl pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowOld(!showOld)}
                >
                  {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">New Password</label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="h-12 rounded-xl pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="h-12 rounded-xl pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Separator />

            {/* BUTTON */}
            <div className="flex justify-end">
              <Button
                className="h-12 px-6 text-white rounded-xl"
                style={{ background: PRIMARY }}
                onClick={updatePassword}
              >
                Update Password
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
