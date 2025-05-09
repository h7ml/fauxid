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
  // Cloudflare Pages适配
  ...(isCloudflare ? { 
    output: 'export', // 适配Cloudflare Pages使用export而非standalone
    distDir: '.next' // 保持默认输出目录
  } : {}),
};

export default nextConfig;
