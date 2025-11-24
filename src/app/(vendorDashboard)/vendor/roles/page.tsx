/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ChefHat, Users, Eye, ClipboardList } from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

const ROLES = ["Manager", "Chef", "Staff", "Viewer"] as const;

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
  const [permissions, setPermissions] =
    useState<Permissions>(initialPermissions);

  /* -------------------------------------------
     FULLY TYPED toggle FUNCTION
  ------------------------------------------- */
  const toggle = <R extends Role, K extends PermissionKey<R>>(
    role: R,
    key: K
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
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-12">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
            Roles & Permissions
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Control what each staff member can access in your vendor panel
          </p>
        </div>

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
                      <h2 className="text-2xl font-bold text-gray-800">
                        {role}
                      </h2>
                      <p className="text-sm text-gray-600">Set access controls</p>
                    </div>
                  </div>

                  <Separator />

                  {/* PERMISSIONS */}
                  <div className="space-y-4">
                    {(Object.keys(
                      permissions[role]
                    ) as PermissionKey<typeof role>[]).map((pKey) => (
                      <div
                        key={pKey}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700 capitalize">
                          {pKey.replace(/([A-Z])/g, " $1")}
                        </span>

                        <Switch
                          checked={permissions[role][pKey]}
                          onCheckedChange={() => toggle(role, pKey)}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full text-white mt-4"
                    style={{ background: PRIMARY }}
                  >
                    Save Changes
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
              <h2 className="font-bold text-lg">AI Recommendations</h2>
            </div>
            <Separator />

            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Managers should have full analytics + finance access.</li>
              <li>Chefs should only access menu & order management.</li>
              <li>Viewer role is ideal for temporary staff or auditors.</li>
              <li>Only trusted staff should have access to payout settings.</li>
            </ul>

            <Button className="text-white" style={{ background: PRIMARY }}>
              Apply Best Practice Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
