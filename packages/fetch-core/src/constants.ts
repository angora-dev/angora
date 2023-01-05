export const ANGORA_FETCH_PARAM_SOURCE = {
  pathname: 'pathname',
} as const;

export const ANGORA_MANIFEST_FILE_NAME = 'angora-manifest.json';

export const DEFAULT_FETCH_OPTIONS = {
  credentials: 'include' as RequestCredentials,
  cache: 'no-cache' as RequestCache,
  method: 'GET',
};
