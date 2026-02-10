"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { Banknote, Info, Lock, Save, ShieldCheck, Wallet } from "lucide-react";

const PRIMARY = "#DC3173";

export default function VendorPaymentSettings() {
  const { t } = useTranslation();
  const [iban, setIban] = useState("PT50 0002 0123 5678 9011 22");
  const [holder, setHolder] = useState("Deligo Vendor");
  const [bank, setBank] = useState("Caixa Geral de Depósitos");

  return (
    <div className="min-h-screen p-6 space-y-10">
      {/* HEADER */}
      <TitleHeader
        title={t("payment_settings")}
        subtitle={t("configure_bank_account_payout_method_security")}
      />

      {/* BANK ACCOUNT SECTION */}
      <Card className="rounded-3xl border bg-white shadow-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="text-gray-700" />
            <h2 className="font-bold text-lg">{t("bank_account")}</h2>
          </div>

          <Separator />

          {/* IBAN */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("iban")}
            </label>
            <Input
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* ACCOUNT HOLDER */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("account_holder_name")}
            </label>
            <Input
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* BANK NAME */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("bank_name")}
            </label>
            <Input
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="bg-white"
            />
          </div>

          <Button className="mt-4 text-white" style={{ background: PRIMARY }}>
            <Save size={16} className="mr-2" /> {t("save_changes")}
          </Button>
        </CardContent>
      </Card>

      {/* PAYOUT METHOD */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-3">
            <Banknote className="text-gray-700" />
            <h2 className="font-bold text-lg">{t("payout_method")}</h2>
          </div>

          <Separator />

          <Select defaultValue="weekly">
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">{t("weekly_every_monday")}</SelectItem>
              <SelectItem value="biweekly">{t("bi_weekly")}</SelectItem>
              <SelectItem value="monthly">{t("monthly")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-xs text-gray-500 mt-1">
            {t("payments_follow_sepa_rules")}
          </div>

          <Button className="mt-4 text-white" style={{ background: PRIMARY }}>
            <Save size={16} className="mr-2" /> {t("save_payout_method")}
          </Button>
        </CardContent>
      </Card>

      {/* SECURITY SECTION */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="text-gray-700" />
            <h2 className="font-bold text-lg">
              {t("security_and_verification")}
            </h2>
          </div>

          <Separator />

          <p className="text-sm text-gray-600 leading-relaxed">
            {t("for_your_safety_payout_changes_require_identity_confirmation")}
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white" style={{ background: PRIMARY }}>
                <ShieldCheck size={16} className="mr-2" />{" "}
                {t("verify_identity")}
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-lg">
                  {t("identity_verification")}
                </DialogTitle>
              </DialogHeader>

              <p className="text-sm text-gray-600 mt-2">
                {t("upload_document_for_payout_security_verification")}
              </p>

              <Input type="file" className="mt-3" />

              <DialogFooter>
                <Button
                  className="text-white mt-4"
                  style={{ background: PRIMARY }}
                >
                  {t("submit")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* INFO BOX */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="text-gray-700" />
            <h2 className="font-bold text-lg">
              {t("portugal_payout_guidelines")}
            </h2>
          </div>

          <Separator />

          <ul className="text-sm text-gray-600 space-y-2">
            <li>• {t("sepa_payouts_take_24_48_hours")}</li>
            <li>• {t("iban_must_be_a_valid_portuguese_or_eu_bank_account")}</li>
            <li>• {t("minimum_payout_threshold_euro_20")}</li>
            <li>• {t("identity_verification_required_for_bank_changes")}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
