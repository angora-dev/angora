import { NextResponse } from 'next/server';

import { getWorldData } from '../../modules/world/world.service';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const response = await getWorldData();

  return NextResponse.json(response);
}
