import { ANGORA_FETCH_PARAM_SOURCE } from './models.constants';

export type AngoraFetchParamSource = keyof typeof ANGORA_FETCH_PARAM_SOURCE;

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
