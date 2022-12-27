import { AngoraFetchData } from '../models/angora-fetch-data';

export type AngoraFetchContextData = {
  addFetchData: (uuid: string, fetchData: AngoraFetchData) => void;
  removeFetchData: (uuid: string) => void;
  getFetchInstance: <T = unknown>(uuid: string, fetchData: AngoraFetchData) => AngoraFetchInstance<T>;
};

export type AngoraResponseStatus = {
  code: number;
  text: string;
};

type BaseAngoraFetchHookData<T = unknown> = {
  body: T | null;
  error: Error | null;
  isFetching: boolean;
  isOK: boolean;
  status: AngoraResponseStatus | null;
};

type OKAngoraFetchHookData<T = unknown> = Omit<BaseAngoraFetchHookData<T>, 'body' | 'isOK'> & {
  body: T;
  isOK: true;
};

type NotOKAngoraFetchHookData<T = unknown> = Omit<BaseAngoraFetchHookData<T>, 'body' | 'isOK'> & {
  body: T | null;
  isOK: false;
};

export type AngoraFetchHookData<T = unknown> = OKAngoraFetchHookData<T> | NotOKAngoraFetchHookData<T>;

export type AngoraFetchInstance<T = unknown> = {
  fetchData: AngoraFetchData;
  hookData: AngoraFetchHookData<T>;
};

export type AngoraFetchInstanceMap<T = unknown> = Map<string, AngoraFetchInstance<T>>;
