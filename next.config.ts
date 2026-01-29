import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // turbopack: {
  //   root: __dirname,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: false,
};

export default nextConfig;
