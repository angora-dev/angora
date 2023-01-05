import { IntegrationTransformers } from '@angora/fetch-core';

import { transformNextRouteToURLPattern } from './utils/transform-next-route-to-url-pattern.util';

export const IGNORED_ENTRYPOINT_FILES = [
  'webpack-runtime',
  'edge-runtime-webpack',
  'webpack-api-runtime',
  '_app',
  '_error',
  '_document',
  'layout',
];

export const NEXT_TRANSFORMERS = {
  transformRouteToURLPattern: transformNextRouteToURLPattern,
} satisfies IntegrationTransformers;
