import { messaging } from "@/src/config/firebase";
import { getToken } from "firebase/messaging";

export async function getFcmToken(): Promise<string | null> {
  if (!messaging) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  return await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
  });
}

export async function saveFcmToken(token: string): Promise<void> {
  const payload = { token };

  await fetch("/api/notifications/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
