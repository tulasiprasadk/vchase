import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  swcMinify: false,
  experimental: {
    esmExternals: false,
  },
  compiler: {
    // Remove optional chaining during compilation for older Node.js
  },
};

export default nextConfig;
