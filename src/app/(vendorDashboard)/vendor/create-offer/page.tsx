"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


const PRIMARY = "#DC3173";
const BG = "#FFF1F7";

export default function VendorCreateOffer() {
  const [type, setType] = useState("percentage");

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
          Create New Offer
        </h1>
        <p className="text-gray-600 text-sm">Add a promotion to boost your restaurant&apos;s sales</p>

        <Card className="rounded-3xl bg-white border shadow-lg">
          <CardContent className="p-6 space-y-8">
            {/* OFFER DETAILS */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Offer Details</h2>
              <Separator />

              <Input placeholder="Offer Title (e.g., 20% OFF on Burgers)" className="h-12 text-base" />

              <Textarea placeholder="Offer Description" className="text-base" rows={4} />

              {/* TYPE */}
              <div className="space-y-2">
                <label className="font-medium text-sm text-gray-700">Offer Type</label>
                <Select onValueChange={setType} defaultValue={"percentage"}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Discount</SelectItem>
                    <SelectItem value="flat">Flat Amount OFF</SelectItem>
                    <SelectItem value="bogo">Buy 1 Get 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CONDITIONAL INPUTS */}
              {type === "percentage" && (
                <Input placeholder="Discount % (e.g., 20)" type="number" className="h-12 text-base" />
              )}

              {type === "flat" && (
                <Input placeholder="Flat Discount (€)" type="number" className="h-12 text-base" />
              )}

              {type === "bogo" && (
                <Input placeholder="Enter item name for B1G1" className="h-12 text-base" />
              )}
            </div>

            {/* VALIDITY */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Validity</h2>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-medium text-sm text-gray-700">Start Date</label>
                  <Input type="date" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-sm text-gray-700">End Date</label>
                  <Input type="date" className="h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-sm text-gray-700">Minimum Order Amount (€)</label>
                <Input type="number" className="h-12 text-base" />
              </div>
            </div>

            {/* PROMO CODE */}
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Promo Code</h2>
              <Separator />
              <Input placeholder="Enter promo code (optional)" className="h-12 text-base uppercase" />
            </div>

            {/* ACTION */}
            <div className="pt-4 flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-6 text-base">Cancel</Button>
              <Button className="h-12 px-6 text-base text-white" style={{ background: PRIMARY }}>
                Create Offer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}