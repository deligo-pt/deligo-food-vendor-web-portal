"use client";

import { getLiveChatSocket, getSupportSocket } from "@/lib/socket";
import { TReadData, TTypingData } from "@/src/types/chat.type";
import { TSupportMessage } from "@/src/types/support.type";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface Props {
  ticketId?: string;
  token: string;
  onMessage: (msg: TSupportMessage) => void;
  onRead?: (data: TReadData) => void;
  onClosed?: () => void;
  onError?: (err: string) => void;
  onTyping?: (data: TTypingData) => void;
  chatType?: "support" | "liveChat";
  willRead?: boolean;
}

export function useChatSocket({
  ticketId,
  token,
  onMessage,
  onRead,
  onClosed,
  onError,
  onTyping,
  chatType = "support",
  willRead,
}: Props) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket =
      chatType === "support"
        ? getSupportSocket(token)
        : getLiveChatSocket(token);

    socketRef.current = socket;

    if (ticketId) {
      socket.emit("join-conversation", { ticketId });
    }

    socket.on("new-message", (msg: TSupportMessage) => {
      onMessage(msg);
      const decoded = jwtDecode(token) as { userId: string };
      if (msg.senderId !== decoded.userId && willRead)
        socket.emit("read-update", { ticketId });
    });

    socket.on("read-update", onRead || (() => {}));
    socket.on("user-typing", onTyping || (() => {}));
    socket.on("conversation-closed", onClosed || (() => {}));
    socket.on("chat-error", (e) => onError && onError(e.message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const sendMessage = (message: string) => {
    console.log("Sending message:", { ticketId, message });
    socketRef.current?.emit("send-message", {
      message,
    });
  };

  const makeTyping = (isTyping: boolean) => {
    socketRef.current?.emit("typing", { ticketId, isTyping });
  };

  const markRead = () => {
    socketRef.current?.emit("mark-read", { ticketId });
  };

  const closeConversation = () => {
    socketRef.current?.emit("close-conversation", { ticketId });
  };

  const turnOffEvents = () => {
    socketRef.current?.off("new-message");
    socketRef.current?.off("user-typing");
    socketRef.current?.off("conversation-closed");
    socketRef.current?.off("chat-error");
  };

  return {
    // socket: socketRef.current,
    sendMessage,
    markRead,
    makeTyping,
    closeConversation,
    turnOffEvents,
  };
}
