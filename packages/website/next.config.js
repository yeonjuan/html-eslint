const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  assetPrefix: "/html-eslint/",
  basePath: "/html-eslint",
  trailingSlash: true,
};

module.exports = nextConfig;
