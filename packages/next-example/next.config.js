const withAngoraFetch = require('@angora/fetch/with-angora-fetch');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
};

module.exports = withAngoraFetch(nextConfig);
