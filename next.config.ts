import type { NextConfig } from "next";
import { version as firebaseVersion } from "firebase/package.json";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  // ✅ Fix for Turbopack + Webpack conflict (Next.js 16+)
  turbopack: {},

  // Inject Firebase version as environment variable
  env: {
    NEXT_PUBLIC_FIREBASE_SDK_VERSION: firebaseVersion,
  },

  // ✅ Webpack config to inject Firebase version dynamically
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          FIREBASE_VERSION: JSON.stringify(firebaseVersion),
        })
      );
    }

    return config;
  },

  // Optional but recommended: Better headers for SW file
  async headers() {
    return [
      {
        source: "/firebase-messaging-sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;