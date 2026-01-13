"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  HelpCircle,
  Search,
  BookOpen,
  Mail,
  PhoneCall,
  MessageCircle,
  FileQuestion,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 8px 24px rgba(0,0,0,0.06)";

export default function VendorHelpPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const FAQ = [
    {
      q: t("faq_q_1"),
      a: t("faq_a_1"),
    },
    {
      q: t("faq_q_2"),
      a: t("faq_a_2"),
    },
    {
      q: t("faq_q_3"),
      a: t("faq_a_3"),
    },
    {
      q: t("faq_q_4"),
      a: t("faq_a_4"),
    },
  ];

  const filtered = FAQ.filter((f) =>
    f.q.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              {t("help_center")}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {t("find_answers_guides_support")}
            </p>
          </div>
          <HelpCircle size={40} className="text-pink-600" />
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <Input
            placeholder={t("search_for_help")}
            className="pl-10 h-12 rounded-2xl border"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Card className="rounded-3xl bg-white border hover:shadow-xl transition" style={{ boxShadow: SHADOW }}>
            <CardContent className="p-6 flex items-center gap-4">
              <BookOpen className="text-pink-600" size={34} />
              <div>
                <h3 className="font-bold text-lg">{t("vendor_guidebook")}</h3>
                <p className="text-sm text-gray-600">{t("learn_how_to_use_deligo")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white border hover:shadow-xl transition" style={{ boxShadow: SHADOW }}>
            <CardContent className="p-6 flex items-center gap-4">
              <ShieldCheck className="text-green-600" size={34} />
              <div>
                <h3 className="font-bold text-lg">{t("policies_and_safety")}</h3>
                <p className="text-sm text-gray-600">{t("rules_for_safe_platform")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white border hover:shadow-xl transition" style={{ boxShadow: SHADOW }}>
            <CardContent className="p-6 flex items-center gap-4">
              <Mail className="text-blue-600" size={34} />
              <div>
                <h3 className="font-bold text-lg">{t("email_support")}</h3>
                <p className="text-sm text-gray-600">support@deligo.pt</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white border hover:shadow-xl transition" style={{ boxShadow: SHADOW }}>
            <CardContent className="p-6 flex items-center gap-4">
              <MessageCircle className="text-purple-600" size={34} />
              <div>
                <h3 className="font-bold text-lg">{t("live_chat")}</h3>
                <p className="text-sm text-gray-600">{t("chat_with_support_team")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* FAQ */}
        <h2 className="text-2xl font-bold" style={{ color: PRIMARY }}>
          {t("frequently_asked_questions")}
        </h2>

        <div className="space-y-4">
          {filtered.map((f, i) => (
            <Card
              key={i}
              className="rounded-2xl bg-white border hover:shadow-md transition"
              style={{ boxShadow: SHADOW }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="max-w-[85%]">
                    <h3 className="font-semibold text-gray-800">{f.q}</h3>
                    <p className="text-sm text-gray-600 mt-1">{f.a}</p>
                  </div>
                  <FileQuestion size={22} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm">{t("no_results_found")}</p>
          )}
        </div>

        {/* CONTACT CTA */}
        <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-7 flex flex-col items-center text-center gap-3">
            <PhoneCall size={40} className="text-pink-600" />
            <h2 className="font-bold text-xl">{t("need_more_help")}</h2>
            <p className="text-sm text-gray-600 max-w-[400px]">
              {t("our_support_team_available")}
            </p>
            <Button style={{ background: PRIMARY }} className="text-white flex items-center gap-2 mt-3">
              {t("contact_support")} <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}