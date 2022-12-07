const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  assetPrefix: isProd ? "/html-eslint" : "",
  basePath: isProd ? "/html-eslint" : "",
};

module.exports = nextConfig;
