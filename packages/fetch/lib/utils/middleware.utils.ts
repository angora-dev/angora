import type { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest, NextResponse } from 'next/server';

import { ANGORA_MANIFEST_FILE_NAME } from '../constants';
import { AngoraData } from '../models/angora-data';
import { AngoraManifest } from '../models/angora-manifest';
import { getFetchDataUrl } from '../models/models.utils';

async function getManifest(nextUrl: NextURL) {
  let origin = nextUrl.origin;

  if (nextUrl.hostname === 'localhost') {
    origin = origin.replace('localhost', '127.0.0.1');
  }

  try {
    const response = await fetch(`${origin}/${ANGORA_MANIFEST_FILE_NAME}`);
    const manifest = (await response.json()) as AngoraManifest;

    return manifest;
  } catch (error) {
    console.error({ error });
  }

  return {} as AngoraManifest;
}

function getPreloadLinkHeaderValue(data: AngoraData) {
  if (!data?.fetch) {
    return null;
  }

  return data.fetch
    .map((fetchData) => `<${getFetchDataUrl(fetchData)}>; rel=preload; as=fetch; crossorigin=use-credentials;`)
    .join(', ');
}

export async function setAngoraFetchHeaders(req: NextRequest, res: NextResponse) {
  const angoraManifest = await getManifest(req.nextUrl);
  const angoraData = angoraManifest[req.nextUrl.pathname];
  const preloadLinkHeaderValue = getPreloadLinkHeaderValue(angoraData);

  if (preloadLinkHeaderValue) {
    res.headers.set('link', preloadLinkHeaderValue);
  }
}
