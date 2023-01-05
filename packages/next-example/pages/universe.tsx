import { getFetchHooks } from '@angora/fetch/next';

import { Universe } from '../modules/universe/universe.component';
import type { UniverseResponseBody } from '../modules/universe/universe.models';

export const angora = {
  fetch: ['/api/universe'],
};

const [useUniverse] = getFetchHooks<[UniverseResponseBody]>(angora);

export default function UniversePage() {
  return <Universe useUniverse={useUniverse} />;
}
