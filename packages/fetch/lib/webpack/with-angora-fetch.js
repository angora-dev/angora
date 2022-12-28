const AngoraFetchPlugin = require('./angore-fetch-plugin');

/** @type {import('next').NextConfig} */
const defaultNextConfig = {};

function withAngoraFetch(nextConfig = defaultNextConfig) {
  /** @type {import('next').NextConfig} */
  const newNextConfig = {
    webpack: (config, { dev, nextRuntime }) => {
      const isEdgeServer = nextRuntime === 'edge';
      const isNodeServer = nextRuntime === 'nodejs';
      const hasAppDir = Boolean(nextConfig?.experimental?.appDir);

      if (isNodeServer || isEdgeServer) {
        config.plugins.push(
          new AngoraFetchPlugin({
            dev,
            isEdgeRuntime: isEdgeServer,
            appDirEnabled: hasAppDir,
          })
        );
      }

      return config;
    },
  };

  return Object.assign({}, nextConfig, newNextConfig);
}

module.exports = withAngoraFetch;
