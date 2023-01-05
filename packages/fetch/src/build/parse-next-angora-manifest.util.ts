import { getSortedRoutes } from 'next/dist/shared/lib/router/utils/sorted-routes';

import { AngoraData, AngoraManifest, ParsedAngoraFetchData, parseFetchData } from '@angora/fetch-core';

import { NEXT_TRANSFORMERS } from '../constants';
import { transformNextRouteToURLPattern } from '../utils/transform-next-route-to-url-pattern.util';

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
