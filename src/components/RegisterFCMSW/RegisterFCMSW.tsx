"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { getAndSaveFcmToken } from "@/src/utils/fcmToken";
import Cookies from "js-cookie";

export function RegisterFCMSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const initializeFCM = async () => {
      try {
        const accessToken = Cookies.get("accessToken");

        // Register Service Worker
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
          scope: "/",
        });

        console.log("✅ FCM Service Worker Registered");

        await navigator.serviceWorker.ready;

        // Handle new version updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                toast.info("New version available", {
                  description: "Reload to apply updates?",
                  action: {
                    label: "Reload",
                    onClick: () => {
                      newWorker.postMessage({ type: "SKIP_WAITING" });
                      window.location.reload();
                    },
                  },
                  duration: 15000,
                });
              }
            });
          }
        });

        // Save FCM Token if logged in
        if (accessToken) {
          setTimeout(() => {
            getAndSaveFcmToken(accessToken);
          }, 1200);
        }
      } catch (error) {
        console.error("❌ FCM Service Worker failed:", error);
      }
    };

    initializeFCM();

    // Periodic update check
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js")?.then((reg) => reg?.update());
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  return null;
}