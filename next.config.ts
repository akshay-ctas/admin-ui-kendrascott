import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kendrascott-clone.s3.ap-south-1.amazonaws.com",
        pathname: "/**", // Allows all images in the bucket
      },
    ],
  },
};

export default nextConfig;
