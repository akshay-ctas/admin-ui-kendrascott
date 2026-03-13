import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kendrascott-clone.s3.amazonaws.com",
        pathname: "/**", // Allows all images in the bucket
      },
      {
        protocol: "https",
        hostname: "kendrascott-clone.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
