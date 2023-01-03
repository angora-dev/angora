import { getFetchHooks } from '@angora/fetch';

import { World } from '../components/World';

export const angora = {
  fetch: ['/api/world'],
};

const [useWorld] = getFetchHooks(angora);

export default function WorldPage() {
  return (
    <>
      <World useWorld={useWorld} />
    </>
  );
}
