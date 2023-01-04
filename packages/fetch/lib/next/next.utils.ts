import { getRouteRegex } from 'next/dist/shared/lib/router/utils/route-regex';
import { getSortedRoutes } from 'next/dist/shared/lib/router/utils/sorted-routes';

import { AngoraData } from '../models/angora-data';
import { ParsedAngoraFetchData } from '../models/angora-fetch-data';
import { AngoraManifest } from '../models/angora-manifest';
import { parseFetchData } from '../models/parse-fetch-data.utils';
import { NEXT_TRANSFORMERS } from './next.constants';

export function parseNextAngoraManifest(angoraManifest: AngoraManifest) {
  const sortedAngoraManifest = sortAngoraManifestRoutesBasedOnNextRouting(angoraManifest);
  const routesTransformedAngoraManifest = transformNextRoutesToAngoraManifestRoutes(sortedAngoraManifest);

  return routesTransformedAngoraManifest;
}

function sortAngoraManifestRoutesBasedOnNextRouting(angoraManifest: AngoraManifest) {
  const routes = Object.keys(angoraManifest);
  const sortedRoutes = getSortedRoutes(routes);
  const sortedAngoraManifest: AngoraManifest = {};

  for (const route of sortedRoutes) {
    sortedAngoraManifest[route] = angoraManifest[route];
  }

  return sortedAngoraManifest;
}

function transformNextRoutesToAngoraManifestRoutes(
  angoraManifest: AngoraManifest
): AngoraManifest<ParsedAngoraFetchData> {
  const parsedAngoraManifest: AngoraManifest<ParsedAngoraFetchData> = {};

  for (const [nextRoute, angoraData] of Object.entries(angoraManifest)) {
    const route = transformNextRouteToURLPattern(nextRoute);
    const parsedFetch = angoraData.fetch.map((fetchData) => parseFetchData(fetchData, NEXT_TRANSFORMERS));
    const parsedAngoraData = { ...angoraData, fetch: parsedFetch } satisfies AngoraData<ParsedAngoraFetchData>;

    parsedAngoraManifest[route] = parsedAngoraData;
  }

  return parsedAngoraManifest;
}

/**
 * Transforms Next.js route path to standard URL Pattern string.
 *
 * Examples:
 *   - `[[...slug]]` -> `:slug*` (repeating optional group)
 *   - `[...slug]` -> `:slug+` (repeating group, minimum one match)
 *   - `[foo]` -> `:slug` (required group)
 *   - `bar` -> `bar`
 *
 * @param nextRoute Next.js route path
 * @returns Standard URL Pattern string
 */
export function transformNextRouteToURLPattern(nextRoute: string) {
  const routeRegex = getRouteRegex(nextRoute);
  let urlPattern = nextRoute;

  for (const [groupName, data] of Object.entries(routeRegex.groups)) {
    if (!data.optional && !data.repeat) {
      urlPattern = urlPattern.replace(`[${groupName}]`, `:${groupName}`);
      continue;
    }

    if (!data.optional && data.repeat) {
      urlPattern = urlPattern.replace(`[...${groupName}]`, `:${groupName}+`);
      continue;
    }

    if (data.optional && data.repeat) {
      urlPattern = urlPattern.replace(`[[...${groupName}]]`, `:${groupName}*`);
      continue;
    }
  }

  return urlPattern;
}
