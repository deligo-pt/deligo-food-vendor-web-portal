"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";

import { useChatSocket } from "@/src/hooks/use-chat-socket";
import { useTranslation } from "@/src/hooks/use-translation";
import { openConversationReq } from "@/src/services/dashboard/chat/chat";
import { TMeta } from "@/src/types";
import { TConversation, TMessage } from "@/src/types/chat.type";
import { getCookie } from "@/src/utils/cookies";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import {
  Bot,
  CheckCheckIcon,
  CheckIcon,
  Clock,
  PhoneCall,
  Send,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface IProps {
  initialConversation: TConversation;
  initialMessagesData: { data: TMessage[]; meta?: TMeta };
}

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 22px rgba(0,0,0,0.06)";

export default function VendorChatSupport({
  initialConversation: conversation,
  initialMessagesData,
}: IProps) {
  const { t } = useTranslation();
  const path = usePathname();
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");

  const [messages, setMessages] = useState<TMessage[]>(
    initialMessagesData?.data || [],
  );
  const [status, setStatus] = useState(conversation.status);

  const accessToken = getCookie("accessToken") || "";
  const decoded = jwtDecode(accessToken) as { userId: string };

  const openConversation = async () => {
    const result = await openConversationReq();
    if (result.success) {
      setStatus("OPEN");
    }
  };

  const { sendMessage } = useChatSocket({
    room: conversation.room,
    token: accessToken as string,
    onMessage: (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (status === "OPEN") {
        setStatus("IN_PROGRESS");
      }
    },
    onRead: () => {
      router.refresh();
    },
    onTyping: (data) => {
      console.log(data);
    },
    onClosed: () => setStatus("CLOSED"),
    onError: (msg) => alert(msg),
    willRead: path === "/vendor/chat-support",
  });

  const handleSendMessage = () => {
    if (!text.trim()) return;

    sendMessage(text);
    setText("");
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[950px] mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              {t("chat_support")}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {t("get_help_from_support_team")}
            </p>
          </div>

          <PhoneCall size={40} className="text-pink-600" />
        </div>

        {/* CHAT CARD */}
        <Card
          className="rounded-3xl bg-white border py-0"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-0">
            {/* TOP */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-pink-100">
                  <Bot className="text-pink-700" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{t("deligo_support")}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {status.charAt(0)}
                    {status.slice(1).toLowerCase().replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div
              ref={scrollRef}
              className="h-[520px] overflow-y-auto p-6 space-y-4 bg-gray-50"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.senderRole === "VENDOR"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.senderRole === "VENDOR"
                        ? "bg-[" + PRIMARY + "] text-white rounded-br-none"
                        : "bg-white rounded-bl-none border"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{msg.message}</div>
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-[10px] opacity-70 mt-1">
                        {format(msg.createdAt as Date, "hh:mm a")}
                      </p>
                      {msg.senderRole === "VENDOR" &&
                        (msg.readBy?.[decoded.userId] ? (
                          <CheckCheckIcon size={14} />
                        ) : (
                          <CheckIcon size={14} />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {status === "CLOSED" ? (
              <div className="p-4 text-center">
                <Button
                  className="text-white bg-[#DC3173] bg-[#DC3173]/90"
                  onClick={openConversation}
                >
                  Get Support
                </Button>
              </div>
            ) : (
              <div className="p-4 flex items-center gap-3">
                <Input
                  placeholder={t("type_your_message")}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />

                <Button
                  onClick={handleSendMessage}
                  className="flex items-center gap-1 text-white"
                  style={{ background: PRIMARY }}
                >
                  <Send size={16} /> {t("send")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
