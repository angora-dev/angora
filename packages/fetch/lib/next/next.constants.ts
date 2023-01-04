import { IntegrationTransformers } from '../models/integration-transformers';
import { transformNextRouteToURLPattern } from './next.utils';

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
