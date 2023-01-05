import { AngoraFetchHookData } from './angora-fetch-hook-data.model';

export type AngoraFetchHook<TBody = unknown> = () => AngoraFetchHookData<TBody>;
