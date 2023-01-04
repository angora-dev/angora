import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  return NextResponse.json({ hello: 'Hello, Universe!' });
}
