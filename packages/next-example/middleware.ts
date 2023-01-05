import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { setAngoraFetchHeaders } from '@angora/fetch';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  await setAngoraFetchHeaders(req, res);

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico|sw.js).*)'],
};
