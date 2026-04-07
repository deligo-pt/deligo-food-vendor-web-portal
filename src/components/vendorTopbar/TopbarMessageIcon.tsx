"use client";

import { USER_ROLE } from "@/src/consts/user.const";
import { useTopbarMessageIconSocket } from "@/src/hooks/use-chat-socket";
import {
  getMyTicketReq,
  getUnreadCountReq,
} from "@/src/services/dashboard/support/support.service";
import { TSupportMessage } from "@/src/types/support.type";
import { getCookie } from "@/src/utils/cookies";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TopbarMessageIcon() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const accessToken = getCookie("accessToken") || "";
  const [ticketId, setTicketId] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const newMessageHandler = (msg: TSupportMessage) => {
    if (msg.senderRole !== USER_ROLE.VENDOR && msg.ticketId === ticketId) {
      getUnreadMessageCount();
      audioRef.current?.play().catch((error) => {
        console.log("Error playing audio:", error);
      });
    }
  };

  const getTicketId = async () => {
    const result = await getMyTicketReq();

    if (result.success) {
      setTicketId(result.data?.ticketId || "");
    }
  };

  const getUnreadMessageCount = async () => {
    const result = await getUnreadCountReq();

    if (result.success) {
      setUnreadCount(result.data || 0);
    }
  };

  const { leaveConversation } = useTopbarMessageIconSocket({
    ticketId,
    token: accessToken as string,
    onMessage: (msg) => newMessageHandler(msg),
    onError: () => {},
  });

  useEffect(() => {
    (() => getUnreadMessageCount())();
    (() => getTicketId())();

    return () => {
      leaveConversation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        className="p-2 rounded-lg hover:bg-pink-50 transition hidden sm:block shrink-0 relative"
      >
        <MessageSquare size={18} className="text-gray-700" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-pink-600 rounded-full border-2 border-white text-[10px] text-white font-medium flex justify-center items-center"
          >
            {unreadCount > 99 ? "99" : unreadCount}
          </motion.span>
        )}
      </motion.button>
      <div className="hidden">
        <audio ref={audioRef} src="/audio/message-sound.mp3" preload="auto" />
      </div>
    </>
  );
}
