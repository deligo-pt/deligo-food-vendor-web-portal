import { messaging } from "@/src/config/firebase";
import { postData } from "@/src/utils/requests";
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

  await postData("/auth/save-fcm-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getAndSaveFcmToken(): Promise<void> {
  try {
    const token = await getFcmToken();
    if (!token) return;
    await saveFcmToken(token);
  } catch (fcmError) {
    console.log(fcmError);
  }
}
