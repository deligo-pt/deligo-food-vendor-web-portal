"use client";

import { getSupportSocket, getTopbarMessageIconSocket } from "@/lib/socket";
import {
  TSupportMessage,
  TSupportTicket,
  TUserTypingPayload,
} from "@/src/types/support.type";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface Props {
  ticketId?: string;
  token: string;
  onMessage: (msg: TSupportMessage) => void;
  onClosed?: () => void;
  onRead?: (data: { ticketId: string; userId: string; time: string }) => void;
  onError: (msg: string) => void;
  onTyping?: (data: TUserTypingPayload) => void;
}

export function useChatSocket({
  ticketId,
  token,
  onMessage,
  onClosed,
  onError,
  onTyping,
  onRead,
}: Props) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSupportSocket(token);
    socketRef.current = socket;

    socket.emit("join-conversation", { ticketId });

    socket.on("new-message", onMessage);
    socket.on("user-typing", (data) => onTyping && onTyping(data));
    socket.on("read-update", (data) => onRead && onRead(data));
    socket.on("conversation-closed", () => onClosed && onClosed());
    socket.on("chat-error", (e) => onError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const sendMessage = (payload: {
    ticketId?: string;
    message: string;
    attachments?: File[];
    messageType: TSupportMessage["messageType"];
    referenceOrderId?: string;
    category?: TSupportTicket["category"];
  }) => {
    socketRef.current?.emit("send-message", payload);
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

  const leaveConversation = () => {
    socketRef.current?.emit("leave-conversation", { ticketId });
  };

  return {
    sendMessage,
    markRead,
    makeTyping,
    closeConversation,
    leaveConversation,
  };
}

export function useTopbarMessageIconSocket({
  ticketId,
  token,
  onMessage,
}: Props) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getTopbarMessageIconSocket(token);
    socketRef.current = socket;

    socket.emit("join-conversation", { ticketId });

    socket.on("new-message", onMessage);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const leaveConversation = () => {
    socketRef.current?.off("new-message");
    socketRef.current?.emit("leave-conversation", { ticketId });
  };

  return {
    leaveConversation,
  };
}
