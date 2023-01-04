import { ParsedAngoraFetchData } from '../models/angora-fetch-data';
import { Subscribe } from './store.models';

export type AngoraFetchContextData<TBody = unknown> = {
  addFetchData: (uuid: string, fetchData: ParsedAngoraFetchData) => void;
  removeFetchData: (uuid: string) => void;
  subscribe: Subscribe<TBody>;
};

export type AngoraResponseStatus = {
  code: number;
  text: string;
};

type BaseAngoraFetchHookData<TBody = unknown> = {
  body: TBody | null;
  error: Error | null;
  isFetching: boolean;
  isOK: boolean;
  status: AngoraResponseStatus | null;
};

type OKAngoraFetchHookData<TBody = unknown> = Omit<BaseAngoraFetchHookData<TBody>, 'body' | 'isOK'> & {
  body: TBody;
  isOK: true;
};

type NotOKAngoraFetchHookData<TBody = unknown> = Omit<BaseAngoraFetchHookData<TBody>, 'body' | 'isOK'> & {
  body: TBody | null;
  isOK: false;
};

export type AngoraFetchHookData<TBody = unknown> = OKAngoraFetchHookData<TBody> | NotOKAngoraFetchHookData<TBody>;

export type AngoraFetchInstance<TBody = unknown> = {
  fetchData: ParsedAngoraFetchData;
  hookData: AngoraFetchHookData<TBody>;
};
