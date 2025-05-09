import type { NextConfig } from "next";

const isCloudflare = process.env.CLOUDFLARE === 'true';

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
    // 仅在Cloudflare环境下禁用图像优化
    ...(isCloudflare ? { unoptimized: true } : {}),
  },
  // 条件添加Cloudflare Pages兼容配置
  ...(isCloudflare ? { output: 'standalone' } : {}),
};

export default nextConfig;
