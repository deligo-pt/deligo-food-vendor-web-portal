"use client";

import { getLiveChatSocket, getSupportSocket } from "@/lib/socket";
import { TMessage, TReadData, TTypingData } from "@/src/types/chat.type";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface Props {
  room?: string;
  token: string;
  onMessage: (msg: TMessage) => void;
  onRead?: (data: TReadData) => void;
  onClosed?: () => void;
  onError?: (err: string) => void;
  onTyping?: (data: TTypingData) => void;
  chatType?: "support" | "liveChat";
  willRead?: boolean;
}

export function useChatSocket({
  room,
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

    socket.emit("join-conversation", { room });

    socket.on("new-message", (msg: TMessage) => {
      onMessage(msg);
      const decoded = jwtDecode(token) as { userId: string };
      if (msg.senderId !== decoded.userId && willRead)
        socket.emit("read-update", { room });
    });
    socket.on("read-update", onRead || (() => {}));
    socket.on("user-typing", onTyping || (() => {}));
    socket.on("conversation-closed", onClosed || (() => {}));
    socket.on("chat-error", (e) => onError && onError(e.message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  const sendMessage = (message: string) => {
    socketRef.current?.emit("send-message", {
      room,
      message,
    });
  };

  const makeTyping = (isTyping: boolean) => {
    socketRef.current?.emit("typing", { room, isTyping });
  };

  const markRead = () => {
    socketRef.current?.emit("mark-read", { room });
  };

  const closeConversation = () => {
    socketRef.current?.emit("close-conversation", { room });
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
