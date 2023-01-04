import { ParsedAngoraFetchData } from '../models/angora-fetch-data';
import { AngoraFetchHookData, AngoraResponseStatus } from './fetch.models';
import { AngoraFetchInstance } from './fetch.models';

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

export function createFetchInstance<TBody = unknown>(fetchData: ParsedAngoraFetchData) {
  return {
    fetchData,
    hookData: createFetchHookData<TBody>(),
  } satisfies AngoraFetchInstance<TBody>;
}

export async function unwrapResponse<TBody = unknown>(response: Response): Promise<TBody> {
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.indexOf('application/json') !== -1) {
    return await response.json();
  }

  return (await response.text()) as unknown as Promise<TBody>;
}
