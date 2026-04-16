"use client";

import { TTicketStatus } from "@/src/types/support.type";
import { AlertTriangle, Send } from "lucide-react";
import { useState } from "react";

interface IProps {
  onSend: (text: string) => void;
  onTyping: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  ticketStatus: TTicketStatus;
}

export default function SupportChatInput({
  onSend,
  onTyping,
  ticketStatus,
}: IProps) {
  const [value, setValue] = useState("");

  const handleMessageTyping = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend(value);
        setValue("");
      }
    }
    onTyping(e);
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100 shrink-0">
      {ticketStatus === "CLOSED" ? (
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
              value={value}
              onChange={(e) => setValue(e.target?.value)}
              onKeyDown={handleMessageTyping}
              placeholder="Type a message..."
              className="w-full bg-transparent px-3 py-2 outline-none text-sm resize-none max-h-32 min-h-10"
            />
          </div>
          <button
            onClick={() => {
              if (value.trim()) {
                onSend(value);
                setValue("");
              }
            }}
            disabled={!value.trim()}
            className="p-3 bg-[#DC3173] text-white rounded-xl hover:bg-[#DC3173]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
