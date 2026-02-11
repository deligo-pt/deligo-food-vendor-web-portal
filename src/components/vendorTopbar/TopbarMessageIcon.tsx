"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useRef } from "react";

export default function TopbarMessageIcon() {
  const audioRef = useRef<HTMLAudioElement>(null);
  //   const path = usePathname();
  //   const accessToken = getCookie("accessToken") || "";

  //   const newMessageHandler = (msg: TMessage) => {
  //     console.log("New message received:", msg);
  //     if (msg.senderRole !== "VENDOR") {
  //       console.log("New message received:", msg);
  //       audioRef.current?.play().catch((error) => {
  //         console.log("Error playing audio:", error);
  //       });
  //     }
  //   };

  //   useChatSocket({
  //     token: accessToken as string,
  //     onMessage: (msg) => newMessageHandler(msg),
  //   });

  //   useEffect(() => {
  //     const socket = getSocket(accessToken);
  //     const accessToken = getCookie("accessToken") || "";

  //     socket.on("new-message", newMessageHandler);
  //   }, [path]);

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
