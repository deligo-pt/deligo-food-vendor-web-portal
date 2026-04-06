"use client";

import { cn } from "@/lib/utils";
import SupportStatusBadge from "@/src/components/Dashboard/Support/SupportTickets/SupportStatusBadge";
import { useChatSocket } from "@/src/hooks/use-chat-socket";
import { getMessagesReq } from "@/src/services/dashboard/support/support.service";
import {
  TSupportMessage,
  TSupportTicket,
  TUserTypingPayload,
} from "@/src/types/support.type";
import { getCookie } from "@/src/utils/cookies";
import { removeUnderscore } from "@/src/utils/formatter";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  AlertTriangle,
  CheckCheckIcon,
  CheckIcon,
  Hash,
  Send,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  ticket: TSupportTicket;
  closeChatSheet: () => void;
}

export default function SupportChatSheet({ ticket, closeChatSheet }: IProps) {
  const msgEndRef = useRef<HTMLDivElement | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<TSupportMessage[]>([]);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [timeoutState, setTimeoutState] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const accessToken = getCookie("accessToken");
  const decoded = (accessToken ? jwtDecode(accessToken) : {}) as {
    userId: string;
  };

  const scrollToBottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleSendMessage = async (text: string) => {
    if (!text) return;

    sendMessage({
      ticketId: ticket.ticketId,
      message: text,
      messageType: "TEXT",
    });

    // reset textarea
    setChatInput("");
  };

  const { sendMessage, leaveConversation, makeTyping } = useChatSocket({
    ticketId: ticket?.ticketId,
    token: accessToken as string,
    onMessage: (msg) => {
      if (msg.ticketId === ticket?.ticketId) {
        setMessages((prev) => {
          if (prev.length >= 50) {
            prev.shift();
          }
          if (prev.findIndex((m) => m._id === msg._id) === -1) {
            return [...prev, msg];
          }
          return prev;
        });
        scrollToBottom();
      }
    },
    onTyping: (data: TUserTypingPayload) => {
      if (data.userId !== decoded?.userId) {
        setOtherUserTyping(data.isTyping);
      }
    },
    onClosed: () => {},
    onRead: () => {},
    onError: (msg) => console.log(msg),
  });

  const handleMessageTyping = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(chatInput);
      clearTimeout(timeoutState);
      setTyping(false);
      makeTyping(false);
    } else {
      if (!typing) {
        setTyping(true);
        makeTyping(true);
      }

      clearTimeout(timeoutState);
      setTimeoutState(
        setTimeout(() => {
          setTyping(false);
          makeTyping(false);
        }, 2000),
      );
    }
  };

  useEffect(() => {
    if (!!ticket) {
      getMessagesReq(ticket?.ticketId, { limit: "50" }).then((result) => {
        setMessages(result.data);
      });
    }
  }, [ticket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      leaveConversation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={closeChatSheet}
        className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-51"
      />
      <motion.div
        initial={{
          x: "100%",
        }}
        animate={{
          x: 0,
        }}
        exit={{
          x: "100%",
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200,
        }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-52 flex flex-col border-l border-gray-100"
      >
        <div className="p-5 border-b border-gray-100 bg-white flex flex-col gap-3 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-gray-400">
                  {ticket.ticketId}
                </span>
                <SupportStatusBadge status={ticket.status} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 line-clamp-2">
                {ticket.lastMessage || "-"}
              </h2>
            </div>
            <button
              onClick={closeChatSheet}
              className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors shrink-0"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div>
              <span className="text-gray-500 flex items-center gap-1">
                <Tag size={12} /> {removeUnderscore(ticket.category)}
              </span>
              {ticket.category === "ORDER_ISSUE" && (
                <span className="text-gray-500 flex items-center gap-1">
                  <Hash size={12} /> {ticket.referenceOrderId?.orderId}
                </span>
              )}
            </div>
            <span className="text-gray-400 ml-auto">
              {format(ticket.createdAt, "dd MMMM yyyy; hh:mm a")}
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
          {messages.map((msg) => {
            const isVendor = msg.senderRole === "VENDOR";
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isVendor ? "items-end" : "items-start"}`}
              >
                <p className="text-xs text-gray-400 mb-1 px-1">
                  {isVendor ? "You" : "Admin"}
                </p>
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${isVendor ? "bg-[#DC3173] text-white rounded-tr-sm" : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"}`}
                >
                  {msg.message}
                  <div className="flex justify-between items-center mt-1 gap-2">
                    <span
                      className={cn(
                        "text-xs block text-right",
                        isVendor ? "text-gray-300" : "text-gray-400",
                      )}
                    >
                      {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                    </span>
                    {isVendor &&
                      (msg.readBy?.[ticket?.userId?._id] ? (
                        <CheckCheckIcon size={16} className="text-indigo-400" />
                      ) : (
                        <CheckIcon size={16} className="text-gray-300" />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={msgEndRef} />

          {otherUserTyping && (
            <div className="flex flex-col gap-1 items-center">
              <span className="text-xs text-gray-500">Admin is typing...</span>
              <div className="flex justify-center gap-1">
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
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          {ticket.status === "CLOSED" ? (
            <div className="text-center p-3 bg-gray-50 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-2">
              <AlertTriangle size={16} />
              This ticket is closed. Please open a new ticket for further
              assistance.
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#DC3173] focus-within:ring-2 focus-within:ring-[#DC3173]/20 transition-all p-1">
                <textarea
                  rows={1}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleMessageTyping}
                  placeholder="Type a message..."
                  className="w-full bg-transparent px-3 py-2 outline-none text-sm resize-none max-h-32 min-h-[40px]"
                />
              </div>
              <button
                onClick={() => handleSendMessage(chatInput)}
                disabled={!chatInput.trim()}
                className="p-3 bg-[#DC3173] text-white rounded-xl hover:bg-[#DC3173]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
