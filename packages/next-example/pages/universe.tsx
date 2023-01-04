import { getFetchHooks } from '@angora/fetch/next';

import { Universe } from '../components/Universe';

export const angora = {
  fetch: ['/api/universe'],
};

const [useUniverse] = getFetchHooks(angora);

export default function UniversePage() {
  return <Universe useUniverse={useUniverse} />;
}
