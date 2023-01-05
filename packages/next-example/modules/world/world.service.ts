import type { WorldResponseBody } from './world.models';

export async function getWorldData(): Promise<WorldResponseBody> {
  // Simulating expensive work
  await new Promise((resolve) => setTimeout(resolve, 100));

  return { hello: 'Hello, World!' };
}
