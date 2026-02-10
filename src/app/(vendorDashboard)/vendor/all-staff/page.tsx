"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import {
  ChefHat,
  ClipboardList,
  Edit,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-6 space-y-12">
      {/* HEADER */}
      <TitleHeader
        title={t("all_staff")}
        subtitle={t("manage_all_staff_members")}
        buttonInfo={{
          text: "Add Staff",
          icon: Plus,
          onClick: () => router.push("/vendor/add-staff"),
        }}
      />

      {/* STAFF LIST */}
      <div className="space-y-6 pt-4">
        <AnimatePresence>
          {STATIC_STAFF.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all"
                style={{ boxShadow: SHADOW }}
              >
                <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-6">
                  {/* LEFT */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                      <User size={26} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {s.name}
                      </h2>

                      <p className="flex items-center gap-2 mt-1 text-sm text-gray-700">
                        {s.role === "Manager" && (
                          <ShieldCheck size={16} className="text-green-600" />
                        )}
                        {s.role === "Chef" && (
                          <ChefHat size={16} className="text-amber-600" />
                        )}
                        {s.role === "Staff" && (
                          <ClipboardList size={16} className="text-blue-600" />
                        )}
                        {s.role}
                      </p>

                      <div className="mt-3 space-y-1 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail size={14} /> {s.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} /> {s.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right md:min-w-[200px] space-y-3">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2 justify-center"
                    >
                      <Edit size={16} /> {t("edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full flex items-center gap-2 justify-center"
                    >
                      <Trash2 size={16} /> {t("remove")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
