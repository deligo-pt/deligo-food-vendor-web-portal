importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js",
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
  // console.log(
  //   "[firebase-messaging-sw.js] Received background message:",
  //   payload,
  // );

  const { title, body, orderId, channelId } = payload.data || {};

  const url =
    channelId === "order_notification" ? "/all-orders/" + orderId : "/";

  const notificationTitle = title || "New Order Received";
  const notificationOptions = {
    body: body || "Check your dashboard for details.",
    icon: "/deligoLogo.png",
    badge: "/badge.png",
    tag: orderId,
    data: { url },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (new URL(client.url).pathname === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
