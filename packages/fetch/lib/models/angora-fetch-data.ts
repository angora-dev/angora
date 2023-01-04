import { ANGORA_FETCH_PARAM_SOURCE } from './models.constants';

export type AngoraFetchParamSource = keyof typeof ANGORA_FETCH_PARAM_SOURCE;

type AngoraFetchParam = {
  name: string;
  source: AngoraFetchParamSource;
};

export type ShortAngoraFetchData = string;

export type ParsedAngoraFetchData = {
  url: string;
  params?: { [paramName: string]: AngoraFetchParam };
};

export type AngoraFetchData = ShortAngoraFetchData | ParsedAngoraFetchData;
