import { AngoraFetchData } from '../models/angora-fetch-data';
import { AngoraFetchHookData, AngoraResponseStatus } from './fetch.models';
import { AngoraFetchInstance } from './fetch.models';

export function createFetchHookData<T = unknown>(
  body?: T | null,
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
  } as AngoraFetchHookData<T>;
}

export function createFetchInstance<T = unknown>(fetchData: AngoraFetchData) {
  return {
    fetchData,
    hookData: createFetchHookData<T>(),
  } satisfies AngoraFetchInstance<T>;
}

export async function unwrapResponse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.indexOf('application/json') !== -1) {
    return await response.json();
  }

  return (await response.text()) as unknown as Promise<T>;
}
