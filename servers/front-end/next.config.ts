import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*",
      },
    ];
  },
  // // standalone 모드로 빌드할지 여부 설정
  // output: "standalone",
  // // 응답 해더에서 서버정보(X-Powered-By: Next.js) 제거
  // poweredByHeader: false,
};

export default nextConfig;
