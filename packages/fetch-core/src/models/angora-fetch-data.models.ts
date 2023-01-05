import { AngoraFetchParamSource } from './angora-fetch-param-source.model';

type AngoraFetchParam = {
  name: string;
  source: AngoraFetchParamSource;
};

export type ShortAngoraFetchData<_TBody = unknown> = string;

export type ParsedAngoraFetchData<_TBody = unknown> = {
  url: string;
  params?: { [paramName: string]: AngoraFetchParam };
};

export type AngoraFetchData<TBody = unknown> = ShortAngoraFetchData<TBody> | ParsedAngoraFetchData<TBody>;
