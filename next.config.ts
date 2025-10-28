import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "img.freepik.com"],
    // Allow external image sources with query strings and wildcard paths.
    // This helps Next's image optimizer accept requests for large remote images
    // (for example image URLs from freepik or other CDNs that include query params).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: [],
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
