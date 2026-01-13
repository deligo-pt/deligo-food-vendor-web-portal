"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  AlertTriangle,
  Upload,
  CheckCircle,
  Send,
  Headphones,
} from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0px 8px 24px rgba(0,0,0,0.06)";

export default function VendorReportIssuePage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const submitReport = () => {
    if (!issueType || !description || !email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              {t("report_an_issue")}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {t("found_problem_submit_report_directly")}
            </p>
          </div>
          <AlertTriangle size={42} className="text-pink-600" />
        </div>

        {/* SUCCESS MESSAGE */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3"
          >
            <CheckCircle className="text-green-600" />
            <p>{t("your_issue_submitted_successfully")}</p>
          </motion.div>
        )}

        {/* FORM CONTAINER */}
        <Card
          className="rounded-3xl bg-white border"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-6 space-y-8">

            {/* SELECT ISSUE TYPE */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t("issue_type")}</label>
              <Select onValueChange={setIssueType}>
                <SelectTrigger className="h-12 rounded-xl bg-white border">
                  <SelectValue placeholder={t("choose_issue_type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">{t("order_issue")}</SelectItem>
                  <SelectItem value="payout">{t("payout_earnings_issue")}</SelectItem>
                  <SelectItem value="menu">{t("menu_items_issue")}</SelectItem>
                  <SelectItem value="ui">{t("ui_dashboard_bug")}</SelectItem>
                  <SelectItem value="delivery">{t("delivery_partner_problem")}</SelectItem>
                  <SelectItem value="other">{t("other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t("your_email")}</label>
              <Input
                placeholder={t("enter_your_email_address")}
                className="h-12 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t("describe_the_issue")}</label>
              <Textarea
                placeholder={t("write_detailed_description")}
                className="min-h-[140px] rounded-xl"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* UPLOAD SCREENSHOT */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">{t("attach_screenshot")}</label>
              <div className="p-4 border rounded-xl bg-gray-50 flex items-center justify-between">
                <span className="text-sm text-gray-600">{t("no_file_chosen")}</span>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload size={16} />
                  {t("upload")}
                </Button>
              </div>
            </div>

            <Separator />

            {/* SUBMIT */}
            <div className="flex justify-end">
              <Button
                onClick={submitReport}
                className="text-white h-12 px-6 flex items-center gap-2 rounded-xl"
                style={{ background: PRIMARY }}
              >
                {t("submit_report")} <Send size={18} />
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* EXTRA HELP */}
        <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Headphones size={40} className="text-pink-600" />
            <h2 className="font-bold text-xl">{t("need_immediate_support")}</h2>
            <p className="text-sm text-gray-600 max-w-[400px]">
              {t("contact_support_team_via_live_chat")}
            </p>
            <Button
              className="h-11 px-6 text-white rounded-xl"
              style={{ background: PRIMARY }}
            >
              {t("open_live_chat")}
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
