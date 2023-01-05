import { ParsedAngoraFetchData } from '@angora/fetch-core';

import { AngoraFetchHookData } from './angora-fetch-hook-data.model';

export type AngoraFetchInstance<TBody = unknown> = {
  fetchData: ParsedAngoraFetchData;
  hookData: AngoraFetchHookData<TBody>;
};
