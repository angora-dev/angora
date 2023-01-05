import { getFetchHooks } from '@angora/fetch/next';

import { World } from '../modules/world/world.component';
import type { WorldResponseBody } from '../modules/world/world.models';

export const angora = {
  fetch: ['/api/world'],
};

const [useWorld] = getFetchHooks<[WorldResponseBody]>(angora);

export default function WorldPage() {
  return <World useWorld={useWorld} />;
}
