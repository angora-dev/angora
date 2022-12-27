import nodeCrypto from 'crypto';

export function getRandomUUID() {
  const cryptoLib = typeof window !== 'undefined' ? window.crypto : nodeCrypto;

  return cryptoLib.randomUUID();
}
