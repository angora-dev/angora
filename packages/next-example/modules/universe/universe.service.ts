import type { UniverseResponseBody } from './universe.models';

export async function getUniverseData(): Promise<UniverseResponseBody> {
  // Simulating expensive work
  await new Promise((resolve) => setTimeout(resolve, 200));

  return { hello: 'Hello, Universe!' };
}
