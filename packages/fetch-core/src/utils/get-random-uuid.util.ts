import nodeCrypto from 'crypto';

export function getRandomUUID() {
  const cryptoLib = globalThis.crypto ? globalThis.crypto : nodeCrypto;

  return cryptoLib.randomUUID();
}

declare global {
  var EdgeRuntime: string | null;
}
