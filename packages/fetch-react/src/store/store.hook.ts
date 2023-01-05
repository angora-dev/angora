import { useCallback, useMemo, useRef } from 'react';

import { Subscribe, Subscriber, SubscriberCallback } from './store.models';

export function useStore<T = unknown>() {
  //#region Subscribers
  const subscribersRef = useRef<Set<Subscriber<T>> | null>(null);

  if (subscribersRef.current === null) {
    subscribersRef.current = new Set();
  }

  const subscribe = useCallback<Subscribe<T>>((uuid: string, callback: SubscriberCallback<T>) => {
    const subscriber = { uuid, callback } satisfies Subscriber<T>;

    subscribersRef.current?.add?.(subscriber);

    return function unsubscribe() {
      subscribersRef.current?.delete?.(subscriber);
    };
  }, []);
  const updateSubscribers = useCallback((uuid: string, data: T) => {
    subscribersRef.current?.forEach?.((subscriber) => {
      if (subscriber.uuid === uuid) {
        subscriber.callback(data);
      }
    });
  }, []);
  //#endregion Subscribers

  //#region State
  const stateRef = useRef<Map<string, T> | null>(null);

  if (stateRef.current === null) {
    stateRef.current = new Map();
  }

  const add = useCallback((uuid: string, data: T) => {
    stateRef.current?.set?.(uuid, data);
    updateSubscribers(uuid, data);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const get = useCallback((uuid: string) => {
    return stateRef.current?.get?.(uuid);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const update = useCallback((uuid: string, updateCallback: (data: T) => T) => {
    const dataToUpdate = structuredClone(get(uuid));

    if (!dataToUpdate) {
      return;
    }

    const updatedData = updateCallback(dataToUpdate);

    stateRef.current?.set?.(uuid, updatedData);
    updateSubscribers(uuid, updatedData);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const remove = useCallback((uuid: string) => {
    stateRef.current?.delete?.(uuid);
  }, []);
  //#endregion State

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const store = useMemo(() => ({ subscribe, add, get, update, remove }), []);

  return store;
}
