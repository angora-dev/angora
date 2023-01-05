export type SubscriberCallback<T = unknown> = (value: T) => void | Promise<void>;

export type Subscriber<T = unknown> = {
  uuid: string;
  callback: SubscriberCallback<T>;
};

export type Unsubscribe = () => void;

export type Subscribe<T = unknown> = (uuid: string, callback: SubscriberCallback<T>) => Unsubscribe;
