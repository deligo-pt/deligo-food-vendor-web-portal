import type { NextConfig } from "next";
import { version as firebaseVersion } from "firebase/package.json";

const nextConfig: NextConfig = {
  images: {
    /**
     * Vercel's image optimizer is off.
     *
     * On 26 Sep 2026 every `/_next/image` request on
     * `test.vendor-food.deligo.pt` answered **402
     * `OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`** — the project's optimization
     * quota was spent — so every product picture rendered as a broken box, the
     * new ones worst of all: an image already in the CDN cache still appeared,
     * one saved that day had never been optimized and never could be.
     *
     * The source images are already WebP served from our own storage, so the
     * optimizer was buying resizing and edge caching, not format conversion.
     * Turning it off trades those for images that load. Remove this line once
     * the quota is raised, and keep `remotePatterns` either way — it is what
     * allows the hosts in the first place.
     */
    unoptimized: true,
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