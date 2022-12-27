import { getFetchHooks } from '@angora/fetch';

import { Universe } from '../components/Universe';

export const angora = {
  fetch: [{ url: '/api/universe' }],
};

const [useUniverse] = getFetchHooks(angora);

export default function UniversePage() {
  return (
    <>
      <Universe useUniverse={useUniverse} />
    </>
  );
}
