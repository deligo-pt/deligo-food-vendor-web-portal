/* eslint-disable @typescript-eslint/no-explicit-any */
import { messaging } from "@/src/config/firebase";
import { updateFcmTockenReq } from "@/src/services/auth/auth";
import { getDeviceInfo } from "@/src/utils/getDeviceInfo";
import { getToken } from "firebase/messaging";
import { cleanupFirebaseDatabases } from "./firebaseDBCleanup";

let isCleaning = false;

export async function getFcmToken(): Promise<string | null> {
  if (!messaging || !("serviceWorker" in navigator)) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return null;
    }

    // Add timeout to prevent infinite hang
    const tokenPromise = getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    });

    const token = await Promise.race([
      tokenPromise,
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("getToken timeout")), 6000)
      )
    ]);

    return token || null;
  } catch (error: any) {
    console.warn("FCM getToken failed:", error);

    const isVersionError = error.name === "VersionError" ||
      error.message?.toLowerCase().includes("version");

    if (isVersionError && !isCleaning) {
      isCleaning = true;
      console.warn("[FCM] Version conflict detected. Running cleanup...");

      try {
        await cleanupFirebaseDatabases();
        await new Promise((r) => setTimeout(r, 1500)); // longer delay

        // Retry with timeout
        const retryToken = await Promise.race([
          getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY! }),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Retry timeout")), 8000))
        ]);

        console.log("[FCM] Recovery successful");
        isCleaning = false;
        return retryToken || null;
      } catch (retryErr) {
        console.error("[FCM] Cleanup + retry failed:", retryErr);
      } finally {
        isCleaning = false;
      }
    }

    return null;
  }
}

// export async function getFcmToken(): Promise<string | null> {
//   if (!messaging) return null;
//   if (!("serviceWorker" in navigator)) return null;

//   const permission = await Notification.requestPermission();
//   if (permission !== "granted") return null;

//   // const registration = await navigator.serviceWorker.ready;

//   return await getToken(messaging, {
//     vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
//     // serviceWorkerRegistration: registration,
//   });
// }

export async function updateFcmToken(token: string): Promise<void> {
  try {
    const deviceInfo = await getDeviceInfo();

    const result = await updateFcmTockenReq({
      token,
      deviceId: deviceInfo.deviceId,
    });

    if (result.success) {
      console.log("FCM token updated successfully!");
      return;
    }

    console.error("Failed to update FCM token:", result);
  } catch (err) {
    console.error("updateFcmToken failed:", err);
    throw err;
  }
}

export async function getAndSaveFcmToken(accessToken: string): Promise<void> {
  try {
    if (!accessToken) {
      console.warn("No access token provided, skipping FCM token update");
      return;
    }

    const token = await getFcmToken();
    if (!token) return;

    const savedToken = localStorage.getItem("deligo-vendor-fcm-token");

    // Only hit the update API if the token is actually new
    if (token !== savedToken) {
      await updateFcmToken(token);
      localStorage.setItem("deligo-vendor-fcm-token", token);
    }
  } catch (fcmError) {
    console.error("Failed to update FCM token:", fcmError);
  }
}
