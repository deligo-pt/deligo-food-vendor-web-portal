"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, ShieldCheck, ChefHat, ClipboardList,  Eye } from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";

export default function VendorAddStaff() {
  const [staff, setStaff] = useState({ name: "", role: "Staff", email: "", phone: "", notes: "" });

  const handleSubmit = () => {
    console.log("New Staff: ", staff);
    alert("Staff Added Successfully ✔");
    setStaff({ name: "", role: "Staff", email: "", phone: "", notes: "" });
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <UserPlus size={32} className="text-pink-600" />
          <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>Add Staff</h1>
        </div>
        <p className="text-gray-600 text-sm -mt-4">Add new team members and assign their role & permissions</p>

        {/* FORM CARD */}
        <Card className="rounded-3xl bg-white border shadow-lg">
          <CardContent className="p-6 space-y-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  placeholder="Full Name"
                  value={staff.name}
                  onChange={(e) => setStaff({ ...staff, name: e.target.value })}
                  className="h-12"
                />

                <Select
                  defaultValue={staff.role}
                  onValueChange={(v) => setStaff({ ...staff, role: v })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Chef">Chef</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Email Address"
                  value={staff.email}
                  onChange={(e) => setStaff({ ...staff, email: e.target.value })}
                  className="h-12"
                />

                <Input
                  placeholder="Phone Number"
                  value={staff.phone}
                  onChange={(e) => setStaff({ ...staff, phone: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>

            {/* Role Preview */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Role Badge Preview</h2>
              <Separator />

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                {staff.role === "Manager" && <ShieldCheck size={24} className="text-green-600" />}
                {staff.role === "Chef" && <ChefHat size={24} className="text-amber-600" />}
                {staff.role === "Staff" && <ClipboardList size={24} className="text-blue-600" />}
                {staff.role === "Viewer" && <Eye size={24} className="text-gray-600" />}

                <span className="font-semibold text-gray-700 text-lg">{staff.role}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Notes (Optional)</h2>
              <Separator />

              <Textarea
                placeholder="Additional notes about the staff member..."
                value={staff.notes}
                onChange={(e) => setStaff({ ...staff, notes: e.target.value })}
                className="text-base"
                rows={4}
              />
            </div>

            {/* Save */}
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" className="h-12 px-6 text-base">Cancel</Button>
              <Button
                className="h-12 px-6 text-base text-white"
                style={{ background: PRIMARY }}
                onClick={handleSubmit}
              >
                Add Staff
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}