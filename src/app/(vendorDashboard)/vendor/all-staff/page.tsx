"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  UserPlus,
  User,
  Mail,
  Phone,
  Trash2,
  Edit,
  ShieldCheck,
  ChefHat,
  ClipboardList,
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

// MOCK STAFF DATA
const STATIC_STAFF = [
  {
    id: "S1",
    name: "Rafael Costa",
    role: "Manager",
    email: "rafael.manager@deligo.pt",
    phone: "+351 912 882 110",
  },
  {
    id: "S2",
    name: "Marta Silva",
    role: "Chef",
    email: "marta.chef@deligo.pt",
    phone: "+351 931 552 443",
  },
  {
    id: "S3",
    name: "Tiago Mendes",
    role: "Staff",
    email: "tiago.staff@deligo.pt",
    phone: "+351 937 221 982",
  },
];

export default function VendorAllStaffPage() {
  const [staff, setStaff] = useState(STATIC_STAFF);
  const [query, setQuery] = useState("");

  const [newStaff, setNewStaff] = useState({ name: "", role: "Staff", email: "", phone: "" });

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.role.toLowerCase().includes(query.toLowerCase())
  );

  const addStaff = () => {
    if (!newStaff.name || !newStaff.email) return;
    const id = "S" + (staff.length + 1);
    setStaff([...staff, { id, ...newStaff }]);
    setNewStaff({ name: "", role: "Staff", email: "", phone: "" });
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              All Staff
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage all staff members for your restaurant</p>
          </div>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Search staff by name or role..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />

        {/* ADD STAFF FORM */}
        <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus size={20} /> Add New Staff</h2>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                className="h-12"
              />

              <Select
                onValueChange={(v) => setNewStaff({ ...newStaff, role: v })}
                defaultValue="Staff"
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Chef">Chef</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Email Address"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="h-12"
              />

              <Input
                placeholder="Phone Number"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                className="h-12"
              />
            </div>

            <Button
              className="h-12 px-6 text-white"
              style={{ background: PRIMARY }}
              onClick={addStaff}
            >
              Add Staff
            </Button>
          </CardContent>
        </Card>

        {/* STAFF LIST */}
        <div className="space-y-6 pt-4">
          <AnimatePresence>
            {filtered.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all" style={{ boxShadow: SHADOW }}>
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                        <User size={26} />
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{s.name}</h2>

                        <p className="flex items-center gap-2 mt-1 text-sm text-gray-700">
                          {s.role === "Manager" && <ShieldCheck size={16} className="text-green-600" />} 
                          {s.role === "Chef" && <ChefHat size={16} className="text-amber-600" />} 
                          {s.role === "Staff" && <ClipboardList size={16} className="text-blue-600" />} 
                          {s.role}
                        </p>

                        <div className="mt-3 space-y-1 text-gray-600 text-sm">
                          <div className="flex items-center gap-2"><Mail size={14} /> {s.email}</div>
                          <div className="flex items-center gap-2"><Phone size={14} /> {s.phone}</div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right md:min-w-[200px] space-y-3">
                      <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                        <Edit size={16} /> Edit
                      </Button>
                      <Button variant="destructive" className="w-full flex items-center gap-2 justify-center">
                        <Trash2 size={16} /> Remove
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-10">No staff found.</p>
        )}

      </div>
    </div>
  );
}
