"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { motion } from "framer-motion";
import { ChefHat, ClipboardList, Eye, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";

const PRIMARY = "#DC3173";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

/* -------------------------------------------
   STRICTLY TYPED PERMISSIONS OBJECT
------------------------------------------- */
const initialPermissions = {
  Manager: {
    manageOrders: true,
    manageMenu: true,
    manageStaff: true,
    viewAnalytics: true,
    financialAccess: true,
  },
  Chef: {
    manageOrders: true,
    manageMenu: true,
    manageStaff: false,
    viewAnalytics: false,
    financialAccess: false,
  },
  Staff: {
    manageOrders: true,
    manageMenu: false,
    manageStaff: false,
    viewAnalytics: false,
    financialAccess: false,
  },
  Viewer: {
    manageOrders: false,
    manageMenu: false,
    manageStaff: false,
    viewAnalytics: true,
    financialAccess: false,
  },
} as const;

// Extract TypeScript types from the object itself
type Permissions = typeof initialPermissions;
type Role = keyof Permissions;
type PermissionKey<R extends Role> = keyof Permissions[R];

export default function VendorRolesPermissions() {
  const { t } = useTranslation();
  const [permissions, setPermissions] =
    useState<Permissions>(initialPermissions);

  const ROLES = [t("manager"), t("chef"), t("staff"), t("viewer")] as const;
  /* -------------------------------------------
     FULLY TYPED toggle FUNCTION
  ------------------------------------------- */
  const toggle = <R extends Role, K extends PermissionKey<R>>(
    role: R,
    key: K,
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key],
      },
    }));
  };

  return (
    <div className="min-h-screen p-6 space-y-12">
      {/* HEADER */}
      <TitleHeader
        title={t("roles_and_permissions")}
        subtitle={t("set_access_controls")}
      />

      {/* ROLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ROLES.map((role, idx) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card
              className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all"
              style={{ boxShadow: SHADOW }}
            >
              <CardContent className="p-6 space-y-5">
                {/* ROLE HEADER */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                    {role === "Manager" && <ShieldCheck size={26} />}
                    {role === "Chef" && <ChefHat size={26} />}
                    {role === "Staff" && <ClipboardList size={26} />}
                    {role === "Viewer" && <Eye size={26} />}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{role}</h2>
                    <p className="text-sm text-gray-600">
                      {t("set_access_controls")}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* PERMISSIONS */}
                <div className="space-y-4">
                  {(
                    Object.keys(
                      permissions[role as Role],
                    ) as PermissionKey<Role>[]
                  ).map((pKey) => (
                    <div
                      key={pKey}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700 capitalize">
                        {pKey.replace(/([A-Z])/g, " $1")}
                      </span>

                      <Switch
                        checked={permissions[role as Role][pKey]}
                        onCheckedChange={() => toggle(role as Role, pKey)}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full text-white mt-4"
                  style={{ background: PRIMARY }}
                >
                  {t("save_changes")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI SUGGESTIONS */}
      <Card className="rounded-3xl bg-white border shadow-md">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="text-gray-800" />
            <h2 className="font-bold text-lg">{t("ai_recommendation")}</h2>
          </div>
          <Separator />

          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>{t("managers_should_have_full_analytics")}</li>
            <li>{t("chefs_should_only_access_menu")}</li>
            <li>{t("viewer_role_is_ideal_temporary")}</li>
            <li>{t("only_trusted_staff_should_access")}</li>
          </ul>

          <Button className="text-white" style={{ background: PRIMARY }}>
            {t("apply_best_practise_setup")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
