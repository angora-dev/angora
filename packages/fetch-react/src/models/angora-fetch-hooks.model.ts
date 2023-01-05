import { AngoraFetchHook } from './angora-fetch-hook.model';

export type AngoraFetchHooks<TFetchBodyArray extends ReadonlyArray<unknown> = unknown[]> = {
  [K in keyof TFetchBodyArray]: AngoraFetchHook<TFetchBodyArray[K]>;
};
