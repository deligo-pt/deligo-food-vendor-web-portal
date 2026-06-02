"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import {
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import { useRouter } from "next/navigation";

const PRIMARY = "#DC3173";
// const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

export default function VendorContactSupport() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen space-y-10">
      {/* HEADER */}
      <TitleHeader
        title={t("contact_support")}
        subtitle={t("reach_out_deligo_support_team")}
      />

      {/* SUPPORT QUICK OPTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Phone Support */}
        <Card
          className="rounded-3xl bg-white border hover:shadow-xl transition"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 text-center space-y-3">
            <PhoneCall size={36} className="mx-auto text-pink-600" />
            <h3 className="font-bold text-lg text-gray-700">{t("call_us")}</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">+351 217 570 184</p>
              <p className="text-sm text-gray-600">+351 920 136 680</p>
            </div>

          </CardContent>
        </Card>

        {/* Email Support */}
        <Card
          className="rounded-3xl bg-white border hover:shadow-xl transition"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 text-center space-y-3">
            <Mail size={36} className="mx-auto text-blue-600" />
            <h3 className="font-bold text-lg text-gray-700">
              {t("email_support")}
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">contact@deligo.pt</p>
              <p className="text-sm text-gray-600">geral@deligo.pt</p>
            </div>
          </CardContent>
        </Card>

        {/* Live Chat */}
        <Card
          className="rounded-3xl bg-white border hover:shadow-xl transition"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 text-center space-y-3">
            <MessageCircle size={36} className="mx-auto text-purple-600" />
            <h3 className="font-bold text-lg text-gray-700">
              {t("live_chat")}
            </h3>
            <p className="text-sm text-gray-600">{t("instant_support")}</p>
            <Button
              onClick={() => router.push("/vendor/chat-support")}
              className="mt-2 px-4 text-white"
              style={{ background: PRIMARY }}
            >
              {t("start_chat")}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />



      {/* EXTRA INFO */}
      <Card
        className="rounded-3xl bg-white border shadow-md"
        style={{ boxShadow: SHADOW }}
      >
        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
          <Clock size={40} className="text-pink-600" />
          <h2 className="font-bold text-xl">{t("support_availability")}</h2>
          <p className="text-sm text-gray-600 max-w-[400px]">
            {t("dedicated_support_agents_available")}
          </p>
          <p className="text-xs text-gray-500">{t("response_time")}</p>
        </CardContent>
      </Card>

      {/* LOCATION */}
      <Card
        className="rounded-3xl bg-white border shadow-md"
        style={{ boxShadow: SHADOW }}
      >
        <CardContent className="p-6 flex items-center gap-4">
          <MapPin size={36} className="text-red-500" />
          <div>
            <h3 className="font-semibold text-gray-700">
              {t("deligo_portugal_office")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("lisbon")}, {t("portugal")}
            </p>
          </div>
          <Globe className="ml-auto text-gray-400" />
        </CardContent>
      </Card>
    </div>
  );
}
