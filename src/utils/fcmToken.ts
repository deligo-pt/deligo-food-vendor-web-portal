import { messaging } from "@/src/config/firebase";
import { getDeviceInfo } from "@/src/utils/getDeviceInfo";
import { getToken } from "firebase/messaging";

export async function getFcmToken(): Promise<string | null> {
  if (!messaging) return null;
  if (!("serviceWorker" in navigator)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  // const registration = await navigator.serviceWorker.ready;

  return await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    // serviceWorkerRegistration: registration,
  });
}

export async function updateFcmToken(
  accessToken: string,
  token: string,
): Promise<void> {
  try {
    const deviceInfo = await getDeviceInfo();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
      throw new Error("API base URL is not defined");
    }

    const endpoint = `${baseUrl}/auth/update-fcm-token`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        token,
        deviceId: deviceInfo.deviceId,
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }
  } catch (err) {
    console.error("updateFcmToken failed:", err);
    throw err;
  }
}

export async function getAndSaveFcmToken(accessToken: string): Promise<void> {
  try {
    const token = await getFcmToken();
    if (!token) return;

    const savedToken = localStorage.getItem("deligo-vendor-fcm-token");

    // Only hit the update API if the token is actually new
    if (token !== savedToken) {
      await updateFcmToken(accessToken, token);
      localStorage.setItem("deligo-vendor-fcm-token", token);
      console.log("FCM Token successfully updated in DB");
    }
  } catch (fcmError) {
    console.error("Failed to update FCM token:", fcmError);
  }
}
