"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Headphones,
  PhoneCall,
  Mail,
  MessageCircle,
  Clock,
  Send,
  MapPin,
  Globe,
  ShieldAlert
} from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

export default function VendorContactSupport() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submitForm = () => {
    if (!name || !email || !msg) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              {t("contact_support")}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {t("reach_out_deligo_support_team")}
            </p>
          </div>
          <Headphones size={48} className="text-pink-600" />
        </div>

        {/* SUCCESS MESSAGE */}
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3"
          >
            <ShieldAlert className="text-green-600" />
            <p>{t("your_message_has_been_delivered")}</p>
          </motion.div>
        )}

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
              <p className="text-sm text-gray-600">+351 920 112 889</p>
              <p className="text-xs text-gray-500">{t("mon_sun_9am_10pm")}</p>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card
            className="rounded-3xl bg-white border hover:shadow-xl transition"
            style={{ boxShadow: SHADOW }}
          >
            <CardContent className="p-6 text-center space-y-3">
              <Mail size={36} className="mx-auto text-blue-600" />
              <h3 className="font-bold text-lg text-gray-700">{t("email_support")}</h3>
              <p className="text-sm text-gray-600">support@deligo.pt</p>
              <p className="text-xs text-gray-500">{t("auto_response_24_7")}</p>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card
            className="rounded-3xl bg-white border hover:shadow-xl transition"
            style={{ boxShadow: SHADOW }}
          >
            <CardContent className="p-6 text-center space-y-3">
              <MessageCircle size={36} className="mx-auto text-purple-600" />
              <h3 className="font-bold text-lg text-gray-700">{t("live_chat")}</h3>
              <p className="text-sm text-gray-600">{t("instant_support")}</p>
              <Button
                className="mt-2 px-4 text-white"
                style={{ background: PRIMARY }}
              >
                {t("start_chat")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* CONTACT FORM */}
        <Card
          className="rounded-3xl bg-white border shadow-md"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-bold" style={{ color: PRIMARY }}>
              {t("send_us_message")}
            </h2>

            {/* Name */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t("your_name")}</label>
              <Input
                className="h-12 rounded-xl"
                placeholder={t("enter_your_name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t("email_address")}</label>
              <Input
                className="h-12 rounded-xl"
                placeholder={t("enter_your_email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t("message")}</label>
              <Textarea
                className="min-h-[150px] rounded-xl"
                placeholder={t("describe_issue_question")}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                onClick={submitForm}
                className="h-12 px-6 text-white rounded-xl flex items-center gap-2"
                style={{ background: PRIMARY }}
              >
                {t("send_message")} <Send size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

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
              <h3 className="font-semibold text-gray-700">{t("deligo_portugal_office")}</h3>
              <p className="text-sm text-gray-600">{t("lisbon")}, {t("portugal")}</p>
            </div>
            <Globe className="ml-auto text-gray-400" />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
