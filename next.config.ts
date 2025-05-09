import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // 增加上传文件大小限制为5MB
      bodySizeLimit: 5 * 1024 * 1024, // 5MB
    },
  },
  images: {
    domains: [
      'avatars.dicebear.com',
      'robohash.org',
      'xsgames.co'
    ],
  },
};

export default nextConfig;
