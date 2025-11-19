"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

import {
  Wallet,
  ShieldCheck,
  Banknote,
  Save,
  Lock,
  Info,
} from "lucide-react";

const PRIMARY = "#DC3173";


export default function VendorPaymentSettings() {
  const [iban, setIban] = useState("PT50 0002 0123 5678 9011 22");
  const [holder, setHolder] = useState("Deligo Vendor");
  const [bank, setBank] = useState("Caixa Geral de Depósitos");

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[#FFF1F7]">
      <div className="max-w-[900px] mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Payment Settings
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Configure bank account, payout method & security
            </p>
          </div>
        </div>

        {/* BANK ACCOUNT SECTION */}
        <Card className="rounded-3xl border bg-white shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="text-gray-700" />
              <h2 className="font-bold text-lg">Bank Account</h2>
            </div>

            <Separator />

            {/* IBAN */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">IBAN</label>
              <Input value={iban} onChange={(e) => setIban(e.target.value)} className="bg-white" />
            </div>

            {/* ACCOUNT HOLDER */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Holder Name</label>
              <Input value={holder} onChange={(e) => setHolder(e.target.value)} className="bg-white" />
            </div>

            {/* BANK NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Bank Name</label>
              <Input value={bank} onChange={(e) => setBank(e.target.value)} className="bg-white" />
            </div>

            <Button
              className="mt-4 text-white"
              style={{ background: PRIMARY }}
            >
              <Save size={16} className="mr-2" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* PAYOUT METHOD */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-3">
              <Banknote className="text-gray-700" />
              <h2 className="font-bold text-lg">Payout Method</h2>
            </div>

            <Separator />

            <Select defaultValue="weekly">
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly (Every Monday)</SelectItem>
                <SelectItem value="biweekly">Bi‑Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-xs text-gray-500 mt-1">
              Payments follow SEPA rules for Portugal.
            </div>

            <Button
              className="mt-4 text-white"
              style={{ background: PRIMARY }}
            >
              <Save size={16} className="mr-2" /> Save Payout Method
            </Button>
          </CardContent>
        </Card>

        {/* SECURITY SECTION */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="text-gray-700" />
              <h2 className="font-bold text-lg">Security & Verification</h2>
            </div>

            <Separator />

            <p className="text-sm text-gray-600 leading-relaxed">
              For your safety, payout changes require identity confirmation. This helps prevent
              unauthorized access and protects your earnings.
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="text-white" style={{ background: PRIMARY }}>
                  <ShieldCheck size={16} className="mr-2" /> Verify Identity
                </Button>
              </DialogTrigger>

              <DialogContent className="rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-lg">Identity Verification</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-600 mt-2">
                  Upload document for payout security verification.
                </p>

                <Input type="file" className="mt-3" />

                <DialogFooter>
                  <Button className="text-white mt-4" style={{ background: PRIMARY }}>
                    Submit
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
              <h2 className="font-bold text-lg">Portugal Payout Guidelines</h2>
            </div>

            <Separator />

            <ul className="text-sm text-gray-600 space-y-2">
              <li>• SEPA payouts take 24–48 hours.</li>
              <li>• IBAN must be a valid Portuguese or EU bank account.</li>
              <li>• Minimum payout threshold: €20.</li>
              <li>• Identity verification required for bank changes.</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
