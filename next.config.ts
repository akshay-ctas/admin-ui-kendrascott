import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["kendrascott-clone.s3.ap-south-1.amazonaws.com"],
  },
};

export default nextConfig;
