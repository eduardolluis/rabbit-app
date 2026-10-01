import type { NextConfig } from "next";

const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN || "https://rabbit-app-aoau.vercel.app";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Force browser API calls through the frontend origin so CORS is never
  // enforced against the separate backend deployment.
  env: {
    NEXT_PUBLIC_BACKEND_URL: "https://rabbit-app-coral.vercel.app",
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
