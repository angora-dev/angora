import { ParsedAngoraFetchData } from '../models/angora-fetch-data.models';
import { AngoraFetchParamSource } from '../models/angora-fetch-param-source.model';
import { removeTrailingSlash } from './remove-trailing-slash.util';

export function getFetchDataParser(currentPatternResult: URLPatternResult | null) {
  return (fetchData: ParsedAngoraFetchData) => {
    if (!currentPatternResult) {
      return fetchData;
    }

    if (!fetchData.url.includes(':')) {
      return fetchData;
    }

    for (const [paramName, param] of Object.entries(fetchData.params ?? {})) {
      const value = getParamValueFromPatternResult(currentPatternResult, param.source, param.name);

      fetchData.url = fetchData.url.replaceAll(`:${paramName}*`, value ?? '');
      fetchData.url = fetchData.url.replaceAll(`:${paramName}+`, value ?? '');
      fetchData.url = fetchData.url.replaceAll(`:${paramName}`, value ?? '');
      fetchData.url = removeTrailingSlash(fetchData.url);
    }

    return fetchData;
  };
}

function getParamValueFromPatternResult(result: URLPatternResult, source: AngoraFetchParamSource, name: string) {
  const componentResult = result[source];

  return componentResult.groups[name];
}
