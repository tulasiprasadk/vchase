import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "img.freepik.com"],
  },
  transpilePackages: [],
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
