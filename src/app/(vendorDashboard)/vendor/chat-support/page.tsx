

"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  
  Send,
  PhoneCall,
  Clock,
  Bot,
  
} from "lucide-react";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 22px rgba(0,0,0,0.06)";

export default function VendorChatSupportPage() {
  const [messages, setMessages] = useState([
    { from: "support", text: "Hello! How can we help you today?", time: "Now" },
  ]);

  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMsg = { from: "vendor", text, time: "Just now" };
    setMessages((prev) => [...prev, newMsg]);
    setText("");

    // Auto bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "support", text: "Thank you, we’re reviewing your message.", time: "Now" },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[950px] mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              Chat Support
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Get help from our support team in real‑time.
            </p>
          </div>

          <PhoneCall size={40} className="text-pink-600" />
        </div>

        {/* CHAT CARD */}
        <Card className="rounded-3xl bg-white border" style={{ boxShadow: SHADOW }}>
          <CardContent className="p-0">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-pink-100"><Bot className="text-pink-700" /></div>
                <div>
                  <h2 className="font-bold text-lg">Deligo Support</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> Active now</p>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div ref={scrollRef} className="h-[520px] overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "vendor" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.from === "vendor"
                        ? "bg-[" + PRIMARY + "] text-white rounded-br-none"
                        : "bg-white rounded-bl-none border"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{msg.text}</div>
                    <p className="text-[10px] opacity-70 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* INPUT */}
            <div className="p-4 flex items-center gap-3">
              <Input
                placeholder="Type your message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1"
              />

              <Button
                onClick={sendMessage}
                className="flex items-center gap-1 text-white"
                style={{ background: PRIMARY }}
              >
                <Send size={16}/> Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
