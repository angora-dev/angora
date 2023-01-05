import { AngoraFetchData, ParsedAngoraFetchData } from '../models/angora-fetch-data.models';
import { IntegrationTransformers } from '../models/integration-transformers.model';
import { isString } from './is-string.util';

export function parseFetchData(
  fetchData: AngoraFetchData,
  transformers: IntegrationTransformers
): ParsedAngoraFetchData {
  if (isString(fetchData)) {
    const pathname = transformers.transformRouteToURLPattern(fetchData);
    const parsedFetchData: ParsedAngoraFetchData = { url: pathname };
    const pattern = new URLPattern({ pathname });
    const patternResult = pattern.exec({ pathname });

    if (!patternResult) {
      return parsedFetchData;
    }

    for (const pathnameGroup of Object.keys(patternResult.pathname.groups)) {
      if (!parsedFetchData.params) {
        parsedFetchData.params = {};
      }

      parsedFetchData.params[pathnameGroup] = {
        name: pathnameGroup,
        source: 'pathname',
      };
    }

    return parsedFetchData;
  }

  return fetchData;
}
