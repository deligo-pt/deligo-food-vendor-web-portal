const FIREBASE_VERSION = "12.7.0";   // ← Temporary fallback

importScripts(
  `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app-compat.js`
);
importScripts(
  `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-messaging-compat.js`
);

firebase.initializeApp({
  apiKey: "AIzaSyAHpLImdbqVhGuqWyqNef3jFd5Qum91MyY",
  authDomain: "deligo-food.firebaseapp.com",
  projectId: "deligo-food",
  storageBucket: "deligo-food.firebasestorage.app",
  messagingSenderId: "703860914762",
  appId: "1:703860914762:web:7967f8476eb322ed82c4b3",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, orderId, channelId } = payload.data || {};

  const url = channelId === "order_notification"
    ? `/vendor/all-orders/${orderId}`
    : "/vendor/dashboard";

  const notificationOptions = {
    body: body || "You have a new message",
    icon: "/deligoLogo.png",
    badge: "/badge.png",
    tag: orderId,
    data: { url },
  };

  self.registration.showNotification(title || "New Message", notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});