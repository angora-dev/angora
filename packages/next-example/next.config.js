const { withAngoraFetch } = require('@angora/fetch/build');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
};

module.exports = withAngoraFetch(nextConfig);
