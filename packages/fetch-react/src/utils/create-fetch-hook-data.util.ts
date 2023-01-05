import { AngoraFetchHookData } from '../models/angora-fetch-hook-data.model';
import { AngoraResponseStatus } from '../models/angora-response-status.model';

export function createFetchHookData<TBody = unknown>(
  body?: TBody | null,
  error?: Error | null,
  isFetching = true,
  isOK = false,
  status: AngoraResponseStatus | null = null
) {
  return {
    body: body ?? null,
    error: error ?? null,
    isFetching,
    isOK,
    status,
  } as AngoraFetchHookData<TBody>;
}
