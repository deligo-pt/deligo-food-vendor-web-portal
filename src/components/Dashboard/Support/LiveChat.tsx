"use client";

import { useChatSocket } from "@/src/hooks/use-chat-socket";
import { TMeta } from "@/src/types";
import { TConversation, TMessage } from "@/src/types/chat.type";
import { getCookie } from "@/src/utils/cookies";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  initialConversation: TConversation;
  initialMessagesData: { data: TMessage[]; meta?: TMeta };
  vendorId: string;
}

export default function LiveChat({
  initialConversation: conversation,
  initialMessagesData,
  vendorId,
}: IProps) {
  const [messages, setMessages] = useState<TMessage[]>(
    initialMessagesData?.data || []
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [typingInfo, setTypingInfo] = useState<{
    userId: string;
    isTyping: boolean;
    name: { firstName: string; lastName: string };
  }>({ userId: "", isTyping: false, name: { firstName: "", lastName: "" } });

  const [status, setStatus] = useState(conversation?.status);
  const accessToken = getCookie("accessToken") || "";

  const { sendMessage, makeTyping } = useChatSocket({
    // const { sendMessage, closeConversation } = useChatSocket({
    room: conversation?.room,
    token: accessToken as string,
    onMessage: (msg) => setMessages((prev) => [...prev, msg]),
    onTyping: (data) => {
      if (vendorId === data.userId) return;
      setTypingInfo({
        userId: data.userId,
        isTyping: data.isTyping,
        name: data.name,
      });
      scrollToBottom();
      setTimeout(() => {
        setTypingInfo({
          userId: "",
          isTyping: false,
          name: { firstName: "", lastName: "" },
        });
      }, 3000);
    },
    onClosed: () => setStatus("CLOSED"),
    onError: (msg) => alert(msg),
  });

  const handleSendMessage = () => {
    if (!text.trim()) return;

    sendMessage(text);
    setText("");
  };

  const handleTyping = (isTyping: boolean) => {
    makeTyping(isTyping);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log(conversation?.room, status);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <section className="py-16 px-4 sm:px-10 lg:px-20">
      <div className="max-w-3xl mx-auto rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[calc(100vh-226px)]">
        {/* Header */}
        <div className="flex items-center gap-3 bg-[#DC3173] p-6 rounded-t-3xl">
          <MessageCircle className="w-7 h-7 text-white" />
          <h2 className="text-white text-2xl font-bold">Live Chat Support</h2>
        </div>

        {status === "CLOSED" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <h3 className="text-xl font-semibold mb-4">Conversation Closed</h3>
            <p className="text-gray-600">
              This conversation has been closed. If you need any assistance,
              please start a new chat on the Support page.
            </p>
          </div>
        ) : conversation?.room ? (
          <>
            {/* Messages */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="flex-1 p-6 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.senderRole === "VENDOR"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow ${
                        msg.senderRole === "VENDOR"
                          ? "bg-[#DC3173] text-white rounded-br-none"
                          : "bg-white rounded-bl-none border"
                      }`}
                    >
                      {msg.message}
                      <p className="text-[10px] opacity-70 mt-1">
                        {formatDistanceToNow(msg.createdAt as Date, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {typingInfo?.isTyping && (
                <div className="max-w-[50%] mx-auto p-3 rounded-2xl bg-slate-200 border border-gray-100 mb-2">
                  <div className="text-xs text-gray-500">
                    Admin is typing...
                  </div>
                  <div className="flex justify-center gap-1 mt-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.12s" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.24s" }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 p-5 bg-gray-200 rounded-b-3xl">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-2xl bg-white placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DC3173] transition"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                  handleTyping(e.currentTarget.value.length > 0);
                }}
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-[#DC3173] hover:bg-[#DC3173]/90 rounded-full transition-all"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <h3 className="text-xl font-semibold mb-4 ">
              No Active Conversation
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              There is no active conversation. Please start a new chat on the
              Support page.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
