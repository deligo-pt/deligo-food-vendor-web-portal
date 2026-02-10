"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import {
  AlertTriangle,
  Bell,
  BellRing,
  CheckCircle,
  Clock,
  Info,
  Mail,
  RefreshCcw,
} from "lucide-react";

const PRIMARY = "#DC3173";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

// MOCK NOTIFICATIONS
const STATIC_NOTIFICATIONS = [
  {
    id: "N1",
    title: "New Order Received",
    message: "Order DG-1032 is waiting for acceptance.",
    type: "order",
    time: "2 min ago",
    icon: <BellRing size={22} className="text-green-600" />,
  },
  {
    id: "N2",
    title: "Low Stock Warning",
    message: "Margherita Pizza is running low.",
    type: "stock",
    time: "10 min ago",
    icon: <AlertTriangle size={22} className="text-amber-600" />,
  },
  {
    id: "N3",
    title: "Payout Processed",
    message: "Weekly payout €84.50 sent to IBAN.",
    type: "payout",
    time: "1 hr ago",
    icon: <CheckCircle size={22} className="text-blue-600" />,
  },
  {
    id: "N4",
    title: "New Customer Review",
    message: "You received a 5-star rating!",
    type: "review",
    time: "3 hrs ago",
    icon: <Info size={22} className="text-pink-600" />,
  },
];

export default function VendorNotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(STATIC_NOTIFICATIONS);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const clearAll = () => setNotifications([]);

  return (
    <div className="min-h-screen p-6 space-y-10">
      {/* HEADER */}
      <TitleHeader
        title={t("notifications")}
        subtitle={t("manage_alerts_system_updates")}
        buttonInfo={{
          text: t("clear_all"),
          icon: RefreshCcw,
          onClick: clearAll,
        }}
      />

      {/* NOTIFICATION LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {notifications.map((n, idx) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card
                className="rounded-2xl bg-white border shadow-md hover:shadow-xl transition-all"
                style={{ boxShadow: SHADOW }}
              >
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="p-3 rounded-2xl bg-gray-100">{n.icon}</div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {n.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Clock size={12} /> {n.time}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            {t("no_notifications_available")}
          </p>
        )}
      </div>

      {/* PREFERENCE SETTINGS */}
      <Card
        className="rounded-3xl bg-white border shadow-md"
        style={{ boxShadow: SHADOW }}
      >
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Bell size={20} /> {t("notification_settings")}
          </h2>
          <Separator />

          {/* EMAIL NOTIFICATIONS */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-700" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {t("email_alerts")}
                </h3>
                <p className="text-xs text-gray-500">
                  {t("get_order_payout_updates_via_email")}
                </p>
              </div>
            </div>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>

          {/* PUSH NOTIFICATIONS */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <BellRing size={20} className="text-gray-700" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {t("push_notifications")}
                </h3>
                <p className="text-xs text-gray-500">
                  {t("instant_alerts_for_orders_reviews")}
                </p>
              </div>
            </div>
            <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              className="text-white h-12 px-6"
              style={{ background: PRIMARY }}
            >
              {t("save_preferences")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
