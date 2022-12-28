const withAngoraFetch = require('@angora/fetch/webpack/with-angora-fetch');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // transpilePackages: ['@angora/fetch'],
  experimental: { appDir: true },
};

module.exports = withAngoraFetch(nextConfig);
