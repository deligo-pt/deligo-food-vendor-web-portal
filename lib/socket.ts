import { io, Socket } from "socket.io-client";

let supportSocket: Socket | null = null;
let topbarMessageIconSocket: Socket | null = null;

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

export const getTopbarMessageIconSocket = (token: string) => {
  if (!topbarMessageIconSocket) {
    topbarMessageIconSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return topbarMessageIconSocket;
};

export const disconnectTopbarMessageIconSocket = () => {
  if (topbarMessageIconSocket) {
    topbarMessageIconSocket.disconnect();
    topbarMessageIconSocket = null;
  }
};
