export type Message<T extends string, P> = {
  type: T;
  payload: P;
}

export const MESSAGE_JOIN_CHANNEL = 'JOIN_CHANNEL';
export const MESSAGE_LOGIN = 'LOGIN';
export const MESSAGE_GENERIC_MESSAGE = 'GENERIC_MESSAGE';

export type LoginPayload = {
  nickname: string;
  server: string;
}

export type JoinChannelPayload = {
  channel: string;
}

export type GenericMessagePayload = {
  message: string;
}

export type MessageRegistry = {
  [MESSAGE_LOGIN]: LoginPayload;
  [MESSAGE_JOIN_CHANNEL]: JoinChannelPayload;
  [MESSAGE_GENERIC_MESSAGE]: GenericMessagePayload;
  // Add new messages here as you create them
};

export type AppMessage = {
  [K in keyof MessageRegistry]: Message<K, MessageRegistry[K]>
}[keyof MessageRegistry];