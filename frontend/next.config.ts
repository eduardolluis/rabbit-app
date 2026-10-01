import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: "https://rabbit-app-coral.vercel.app",
  },
};

export default nextConfig;
