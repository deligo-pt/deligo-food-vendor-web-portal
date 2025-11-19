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

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0px 8px 24px rgba(0,0,0,0.06)";

export default function VendorReportIssuePage() {
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
              Report an Issue
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Found a problem? Submit a report directly to the Deligo admin team.
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
            <p>Your issue has been submitted successfully. Our support team will contact you soon.</p>
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
              <label className="font-semibold text-gray-700">Issue Type</label>
              <Select onValueChange={setIssueType}>
                <SelectTrigger className="h-12 rounded-xl bg-white border">
                  <SelectValue placeholder="Choose issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">Order Issue</SelectItem>
                  <SelectItem value="payout">Payout / Earnings Issue</SelectItem>
                  <SelectItem value="menu">Menu / Items Issue</SelectItem>
                  <SelectItem value="ui">UI / Dashboard Bug</SelectItem>
                  <SelectItem value="delivery">Delivery Partner Problem</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Your Email</label>
              <Input
                placeholder="Enter your email address"
                className="h-12 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Describe the Issue</label>
              <Textarea
                placeholder="Write a detailed description of the problem…"
                className="min-h-[140px] rounded-xl"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* UPLOAD SCREENSHOT */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Attach Screenshot (optional)</label>
              <div className="p-4 border rounded-xl bg-gray-50 flex items-center justify-between">
                <span className="text-sm text-gray-600">No file chosen</span>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload
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
                Submit Report <Send size={18} />
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* EXTRA HELP */}
        <Card className="rounded-3xl bg-white border shadow-md" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Headphones size={40} className="text-pink-600" />
            <h2 className="font-bold text-xl">Need Immediate Support?</h2>
            <p className="text-sm text-gray-600 max-w-[400px]">
              Contact our support team via live chat or email for faster assistance.
            </p>
            <Button
              className="h-11 px-6 text-white rounded-xl"
              style={{ background: PRIMARY }}
            >
              Open Live Chat
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
