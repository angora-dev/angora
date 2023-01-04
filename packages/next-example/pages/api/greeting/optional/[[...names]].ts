import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const params = new URL(req.url).searchParams;

  return NextResponse.json({ names: params.getAll('names') });
}
