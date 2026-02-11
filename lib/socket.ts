import { io, Socket } from "socket.io-client";

let supportSocket: Socket | null = null;
let liveChatSocket: Socket | null = null;

export const getSupportSocket = (token: string) => {
  if (!supportSocket) {
    supportSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return supportSocket;
};

export const disconnectSupportSocket = () => {
  if (supportSocket) {
    supportSocket.disconnect();
    supportSocket = null;
  }
};

export const getLiveChatSocket = (token: string) => {
  if (!liveChatSocket) {
    liveChatSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return liveChatSocket;
};

export const disconnectLiveSocket = () => {
  if (liveChatSocket) {
    liveChatSocket.disconnect();
    liveChatSocket = null;
  }
};
