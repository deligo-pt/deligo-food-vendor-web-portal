"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

import {
  Building,
  MapPin,
  Clock,
  Phone,
  Mail,
  Save,
  Globe,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0px 6px 20px rgba(0,0,0,0.06)";

export default function BusinessInfoPage() {
  const [form, setForm] = useState({
    businessName: "Deligo Vendor",
    address: "Rua Central 120, Lisbon, Portugal",
    phone: "+351 920 112 334",
    email: "vendor@example.com",
    website: "https://your-restaurant.com",
    about: "We are a premium food service offering fast delivery across the city.",
    openingHours: "Mon–Sun: 10:00 AM – 11:00 PM",
  });

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
            Business Information
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your restaurant profile, branding & public information.
          </p>
        </div>

        {/* MAIN FORM CARD */}
        <Card className="rounded-3xl bg-white shadow-md border" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-6 space-y-8">

            {/* BUSINESS NAME */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <label className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                <Building size={20} /> Business Name
              </label>
              <Input
                className="h-12"
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
              />
            </motion.div>

            <Separator />

            {/* ADDRESS */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <label className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                <MapPin size={20} /> Address
              </label>
              <Input
                className="h-12"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </motion.div>

            {/* CONTACT INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <label className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                  <Phone size={20} /> Phone Number
                </label>
                <Input
                  className="h-12"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <label className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                  <Mail size={20} /> Email
                </label>
                <Input
                  className="h-12"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </motion.div>
            </div>

            {/* WEBSITE */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <label className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                <Globe size={20} /> Website (Optional)
              </label>
              <Input
                className="h-12"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </motion.div>

            <Separator />

            {/* ABOUT BUSINESS */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <label className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                About Business
              </label>
              <Textarea
                className="min-h-[120px]"
                value={form.about}
                onChange={(e) => update("about", e.target.value)}
              />
            </motion.div>

            {/* OPENING HOURS */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <label className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                <Clock size={20} /> Opening Hours
              </label>
              <Input
                className="h-12"
                value={form.openingHours}
                onChange={(e) => update("openingHours", e.target.value)}
              />
            </motion.div>

            {/* SAVE BUTTON */}
            <div className="pt-4 flex justify-end">
              <Button
                className="text-white h-12 px-6 flex items-center gap-2"
                style={{ background: PRIMARY }}
              >
                <Save size={18} /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
