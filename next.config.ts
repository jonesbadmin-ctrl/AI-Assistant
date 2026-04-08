import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['loca.lt', '100.126.52.5'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;