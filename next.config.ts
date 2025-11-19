import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
<<<<<<< HEAD
=======
      {
        protocol: "http",
        hostname: "**",
      },
>>>>>>> refs/remotes/origin/sayed
    ],
  },
};

export default nextConfig;
