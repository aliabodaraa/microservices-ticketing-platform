import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // webpackDevMiddleware: (config: any) => {
  //   config.watchOptions.poll = 300;
  //   return config;
  // },
  allowedDevOrigins: ["ticketing.dev"],
  reactStrictMode: false,
};

export default nextConfig;
