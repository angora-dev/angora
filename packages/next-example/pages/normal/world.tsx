import { getFetchHooks } from '@angora/fetch/next';

import { World } from '../../modules/world/world.component';
import type { WorldResponseBody } from '../../modules/world/world.models';

const [useWorld] = getFetchHooks<[WorldResponseBody]>({
  fetch: [{ url: '/api/world' }],
});

export default function WorldPage() {
  return <World useWorld={useWorld} />;
}
