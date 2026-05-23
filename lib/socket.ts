import { io, Socket } from "socket.io-client";

let supportSocket: Socket | null = null;
let topbarMessageIconSocket: Socket | null = null;

const resolveSocketUrl = () => {
  const explicitSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();

  if (
    explicitSocketUrl &&
    !explicitSocketUrl.includes("localhost") &&
    !explicitSocketUrl.includes("127.0.0.1")
  ) {
    return explicitSocketUrl.replace(/\/$/, "");
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (apiBaseUrl) {
    try {
      const parsedUrl = new URL(apiBaseUrl);
      return `${parsedUrl.protocol}//${parsedUrl.host}`;
    } catch {
      return apiBaseUrl.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    }
  }

  return explicitSocketUrl?.replace(/\/$/, "") || "";
};

export const getSupportSocket = (token: string) => {
  if (!supportSocket) {
    supportSocket = io(resolveSocketUrl(), {
      auth: { token },
      withCredentials: true,
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
    topbarMessageIconSocket = io(resolveSocketUrl(), {
      auth: { token },
      withCredentials: true,
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
