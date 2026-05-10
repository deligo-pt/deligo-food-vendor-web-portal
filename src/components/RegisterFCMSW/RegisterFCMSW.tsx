"use client";

import { getAndSaveFcmToken } from "@/src/utils/fcmToken";
import { useEffect } from "react";
import Cookies from "js-cookie";

export function RegisterFCMSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const accessToken = Cookies.get("accessToken");

    const initializeFCM = async () => {
      try {
        // Get existing or register new SW
        let reg = await navigator.serviceWorker.getRegistration("/");

        if (!reg) {
          reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          console.log("FCM SW Registered");
        }
        // Wait for the service worker to be ready
        await navigator.serviceWorker.ready;

        //  Call our updated sync logic
        if (accessToken) {
          await getAndSaveFcmToken(accessToken);
        }

      } catch (error) {
        console.error("FCM Initialization failed:", error);
      }
    };

    initializeFCM();
  }, []);

  return null;
}