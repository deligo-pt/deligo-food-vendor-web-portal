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
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload,
  );

  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: payload.notification?.icon || "/favicon.ico",
    badge: "/badge.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
