import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is the default bundler in Next.js 16.
  // Explicitly declare it so Webpack fallback never kicks in
  // (which caused 200+ second compile times).
  turbopack: {},
};

export default nextConfig;
