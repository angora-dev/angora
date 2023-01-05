import type { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest, NextResponse } from 'next/server';

import {
  ANGORA_MANIFEST_FILE_NAME,
  AngoraData,
  AngoraManifest,
  getFetchDataParser,
  ParsedAngoraFetchData,
} from '@angora/fetch-core';

export async function setAngoraFetchHeaders(req: NextRequest, res: NextResponse) {
  const angoraManifest = await getManifest(req.nextUrl);
  const angoraData = getParsedAngoraData(angoraManifest, req.nextUrl.pathname);
  const preloadLinkHeaderValue = getPreloadLinkHeaderValue(angoraData);

  if (preloadLinkHeaderValue) {
    res.headers.set('link', preloadLinkHeaderValue);
  }
}

async function getManifest(nextUrl: NextURL) {
  let origin = nextUrl.origin;

  if (nextUrl.hostname === 'localhost') {
    origin = origin.replace('localhost', '127.0.0.1');
  }

  try {
    const response = await fetch(`${origin}/${ANGORA_MANIFEST_FILE_NAME}`);
    const manifest = (await response.json()) as AngoraManifest<ParsedAngoraFetchData>;

    return manifest;
  } catch (error) {
    console.error({ error });
  }

  return {} as AngoraManifest<ParsedAngoraFetchData>;
}

function getParsedAngoraData(angoraManifest: AngoraManifest<ParsedAngoraFetchData>, currentPath: string) {
  for (const [pathname, data] of Object.entries(angoraManifest)) {
    if (pathname === currentPath) {
      return data;
    }

    const pattern = new URLPattern({ pathname });
    const patternResult = pattern.exec({ pathname: currentPath });

    if (patternResult) {
      return parseAngoraData(patternResult, data);
    }
  }

  return null;
}

function parseAngoraData(currentPatternResult: URLPatternResult | null, data: AngoraData<ParsedAngoraFetchData>) {
  if (!currentPatternResult) {
    return data;
  }

  const parsedData = structuredClone(data);
  parsedData.fetch = parsedData.fetch.map(getFetchDataParser(currentPatternResult));

  return parsedData;
}

function getPreloadLinkHeaderValue(data: AngoraData<ParsedAngoraFetchData> | null) {
  if (!data?.fetch) {
    return null;
  }

  return data.fetch
    .map((fetchData) => `<${fetchData.url}>; rel=preload; as=fetch; crossorigin=use-credentials;`)
    .join(', ');
}
