import { NextResponse } from 'next/server';

import { getUniverseData } from '../../modules/universe/universe.service';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const response = await getUniverseData();

  return NextResponse.json(response);
}
