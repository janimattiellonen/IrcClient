export type Message<T extends string, P> = {
  type: T;
  payload: P;
};

export type User = {
  nick: string;
  user: string;
  host: string;
};
