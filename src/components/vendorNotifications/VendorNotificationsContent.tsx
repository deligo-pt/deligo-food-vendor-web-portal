"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { TMeta } from "@/src/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BellRing,
  CheckCircle,
  Clock,
  Info,
  Mail,
} from "lucide-react";

export type TVendorNotification = {
  _id: string;
  receiverId: string;
  receiverRole: string;
  title: string;
  message: string;
  data: Record<string, string>;
  type: "ORDER" | "SYSTEM" | "PROMO" | "ACCOUNT" | "OTHER";
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type IProps = {
  initialNotifications: TVendorNotification[];
  meta?: TMeta;
};

const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

const notificationStyles: Record<
  TVendorNotification["type"],
  { icon: typeof BellRing; iconColor: string; bgColor: string }
> = {
  ORDER: {
    icon: BellRing,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  SYSTEM: {
    icon: Info,
    iconColor: "text-sky-600",
    bgColor: "bg-sky-50",
  },
  PROMO: {
    icon: Mail,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  ACCOUNT: {
    icon: CheckCircle,
    iconColor: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  OTHER: {
    icon: AlertTriangle,
    iconColor: "text-slate-600",
    bgColor: "bg-slate-100",
  },
};

const formatRelativeTime = (value: string) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export default function VendorNotificationsContent({
  initialNotifications,
  meta,
}: IProps) {
  const { t } = useTranslation();
  const notifications = initialNotifications;

  return (
    <div className="min-h-screen space-y-10">
      <TitleHeader
        title={t("notifications")}
        subtitle={t("Manage alerts system updates")}
      />

      <div className="flex items-center justify-between text-sm text-slate-500 px-1">
        <span>
          {meta?.total
            ? `${meta.total} notification${meta.total > 1 ? "s" : ""}`
            : t("No Notifications Available")}
        </span>
        {meta?.page && meta?.totalPage ? (
          <span>
            Page {meta.page} of {meta.totalPage}
          </span>
        ) : null}
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications.map((notification, index) => {
            const style =
              notificationStyles[notification.type] || notificationStyles.OTHER;
            const Icon = style.icon;

            return (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card
                  className={cn(
                    "rounded-2xl bg-white border transition-all hover:shadow-xl",
                    !notification.isRead && "border-[#DC3173]/25",
                  )}
                  style={{ boxShadow: SHADOW }}
                >
                  <CardContent className="p-6 flex items-start gap-5">
                    <div className={cn("p-3 rounded-2xl", style.bgColor)}>
                      <Icon size={22} className={style.iconColor} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-800 truncate">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="inline-flex items-center rounded-full bg-[#DC3173]/10 px-2 py-0.5 text-[11px] font-semibold text-[#DC3173]">
                                Unread
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mt-1 leading-6">
                            {notification.message}
                          </p>
                        </div>

                        <p className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
                          <Clock size={12} />
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium uppercase tracking-wide">
                          {notification.type.toLowerCase()}
                        </span>
                        {notification.data?.orderId ? (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">
                            Order {notification.data.orderId}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            {t("No Notifications Available")}
          </p>
        )}
      </div>
    </div>
  );
}
