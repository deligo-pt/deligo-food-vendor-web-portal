"use client";

import { getSupportSocket } from "@/lib/socket";
import { useChatSocket } from "@/src/hooks/use-chat-socket";
import { TConversation, TMessage } from "@/src/types/chat.type";
import { catchAsync } from "@/src/utils/catchAsync";
import { getCookie } from "@/src/utils/cookies";
import { fetchData } from "@/src/utils/requests";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TopbarMessageIcon() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [liveChatRoom, setLiveChatRoom] = useState("");
  const accessToken = getCookie("accessToken") || "";

  const newMessageHandler = (msg: TMessage) => {
    if (msg.senderRole !== "VENDOR") {
      audioRef.current?.play().catch((error) => {
        console.log("Error playing audio:", error);
      });
    }
  };

  const getRoom = async () => {
    const result = await catchAsync<TConversation[]>(async () => {
      return await fetchData("/support/conversations", {
        params: { type: "VENDOR_CHAT" },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    });
    if (result.success) {
      setLiveChatRoom(result.data?.[0]?.room);
    }
  };

  useChatSocket({
    room: liveChatRoom,
    token: accessToken as string,
    onMessage: (msg) => newMessageHandler(msg),
    chatType: "liveChat",
  });

  useEffect(() => {
    const accessToken = getCookie("accessToken") || "";
    const supportSocket = getSupportSocket(accessToken);

    supportSocket.on("new-message", newMessageHandler);
  }, []);

  useEffect(() => {
    (() => getRoom())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        className="p-2 rounded-lg hover:bg-pink-50 transition hidden sm:block shrink-0 relative"
      >
        <MessageSquare size={18} className="text-gray-700" />
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-pink-600 rounded-full border-2 border-white"
        />
      </motion.button>
      <div className="hidden">
        <audio ref={audioRef} src="/audio/message-sound.mp3" preload="auto" />
      </div>
    </>
  );
}
