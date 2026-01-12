"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";

import { useChatSocket } from "@/src/hooks/use-chat-socket";
import { TMeta } from "@/src/types";
import { TConversation, TMessage } from "@/src/types/chat.type";
import { getCookie } from "@/src/utils/cookies";
import { format } from "date-fns";
import { Bot, Clock, PhoneCall, Send } from "lucide-react";
import { useTranslation } from "@/src/hooks/use-translation";

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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<TMessage[]>(
    initialMessagesData?.data || []
  );
  const [text, setText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState(conversation.status);
  const accessToken = getCookie("accessToken");

  const { sendMessage } = useChatSocket({
    // const { sendMessage, closeConversation } = useChatSocket({
    room: conversation.room,
    token: accessToken as string,
    onMessage: (msg) => setMessages((prev) => [...prev, msg]),
    onClosed: () => setStatus("CLOSED"),
    onError: (msg) => alert(msg),
  });

  const handleSendMessage = () => {
    if (!text.trim()) return;

    sendMessage(text);
    setText("");
  };

  // const handleSendMessage = () => {
  //   if (!text.trim()) return;

  //   // const newMsg = { from: "vendor", text, time: "Just now" };
  //   // setMessages((prev) => [...prev, newMsg]);
  //   // setText("");

  //   if (!text.trim()) return;
  //   socketRef.current?.emit("message", text);
  //   // setMessages((prev) => [
  //   //   ...prev,
  //   //   { from: "vendor", text, time: "Just now" },
  //   // ]);

  //   setText("");

  //   // Auto bot reply
  //   setTimeout(() => {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         from: "support",
  //         text: "Thank you, we’re reviewing your message.",
  //         time: "Now",
  //       },
  //     ]);
  //   }, 1000);
  // };

  //  useChatSocket({
  //     room: conversation.room,
  //     onMessage: (msg) =>
  //       setMessages((prev) => [...prev, msg]),
  //     onClose: () =>
  //       setConversation((c) => ({ ...c, status: "CLOSED" })),
  //   });

  // connect to room with socket.io-client
  // useEffect(() => {
  //   const accessToken = getCookie("accessToken");
  //   const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  //     reconnectionDelayMax: 10000,
  //     auth: {
  //       token: accessToken,
  //     },
  //   });
  //   socketRef.current = socket;
  //   socket.on("message", (msg) => {
  //     setMessages((prev) => [...prev, msg]);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Socket disconnected");
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

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
          className="rounded-3xl bg-white border"
          style={{ boxShadow: SHADOW }}
        >
          <CardContent className="p-0">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-pink-100">
                  <Bot className="text-pink-700" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{t("deligo_support")}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {t("active_now")}
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
                  className={`flex ${msg.senderRole === "VENDOR"
                    ? "justify-end"
                    : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.senderRole === "VENDOR"
                      ? "bg-[" + PRIMARY + "] text-white rounded-br-none"
                      : "bg-white rounded-bl-none border"
                      }`}
                  >
                    <div className="text-sm leading-relaxed">{msg.message}</div>
                    <p className="text-[10px] opacity-70 mt-1">
                      {format(msg.createdAt as Date, "hh:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* INPUT */}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
