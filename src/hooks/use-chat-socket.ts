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
  const handlersRef = useRef({
    onMessage,
    onClosed,
    onError,
    onTyping,
    onRead,
  });

  useEffect(() => {
    handlersRef.current = {
      onMessage,
      onClosed,
      onError,
      onTyping,
      onRead,
    };
  }, [onClosed, onError, onMessage, onRead, onTyping]);

  useEffect(() => {
    const socket = getSupportSocket(token);
    socketRef.current = socket;

    const handleMessage = (msg: TSupportMessage) => handlersRef.current.onMessage(msg);
    const handleTyping = (data: TUserTypingPayload) =>
      handlersRef.current.onTyping && handlersRef.current.onTyping(data);
    const handleRead = (data: { ticketId: string; userId: string; time: string }) =>
      handlersRef.current.onRead && handlersRef.current.onRead(data);
    const handleClosed = () => handlersRef.current.onClosed && handlersRef.current.onClosed();
    const handleError = (error: string) => handlersRef.current.onError(error);

    socket.emit("join-conversation", { ticketId });

    socket.on("new-message", handleMessage);
    socket.on("user-typing", handleTyping);
    socket.on("read-update", handleRead);
    socket.on("conversation-closed", handleClosed);
    socket.on("chat-error", handleError);

    return () => {
      socket.off("new-message", handleMessage);
      socket.off("user-typing", handleTyping);
      socket.off("read-update", handleRead);
      socket.off("conversation-closed", handleClosed);
      socket.off("chat-error", handleError);
    };
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
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const socket = getTopbarMessageIconSocket(token);
    socketRef.current = socket;

    const handleMessage = (msg: TSupportMessage) => onMessageRef.current(msg);

    socket.emit("join-conversation", { ticketId });

    socket.on("new-message", handleMessage);

    return () => {
      socket.off("new-message", handleMessage);
    };

  }, [ticketId]);

  const leaveConversation = () => {
    socketRef.current?.off("new-message");
    socketRef.current?.emit("leave-conversation", { ticketId });
  };

  return {
    leaveConversation,
  };
}
