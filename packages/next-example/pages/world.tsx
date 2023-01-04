import { getFetchHooks } from '@angora/fetch/next';

import { World } from '../components/World';

export const angora = {
  fetch: ['/api/world'],
};

const [useWorld] = getFetchHooks(angora);

export default function WorldPage() {
  return <World useWorld={useWorld} />;
}
