import type { NextConfig } from 'next';

import { AngoraFetchPlugin } from './angora-fetch-plugin';

export default function withAngoraFetch(nextConfig: NextConfig = {}) {
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
  } satisfies NextConfig;

  return Object.assign({}, nextConfig, newNextConfig);
}
