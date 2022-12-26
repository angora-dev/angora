const AngoraFetchPlugin = require('./angore-fetch-plugin');

function withAngoraFetch(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
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
  });
}

module.exports = withAngoraFetch;
