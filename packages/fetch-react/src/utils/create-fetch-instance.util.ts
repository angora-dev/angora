import { ParsedAngoraFetchData } from '@angora/fetch-core';

import { AngoraFetchInstance } from '../models/angora-fetch-instance.model';
import { createFetchHookData } from './create-fetch-hook-data.util';

export function createFetchInstance<TBody = unknown>(fetchData: ParsedAngoraFetchData) {
  return {
    fetchData,
    hookData: createFetchHookData<TBody>(),
  } satisfies AngoraFetchInstance<TBody>;
}
