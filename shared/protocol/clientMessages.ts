import type { Message } from './types';

export const MESSAGE_LOGIN = 'LOGIN' as const;
export const MESSAGE_JOIN_CHANNEL = 'JOIN_CHANNEL' as const;
export const MESSAGE_SEND_MESSAGE = 'SEND_MESSAGE' as const;
export const MESSAGE_PART_CHANNEL = 'PART_CHANNEL' as const;

export type LoginPayload = {
  nickname: string;
  server: string;
  port: number;
};

export type JoinChannelPayload = {
  channel: string;
};

export type SendMessagePayload = {
  channel: string;
  message: string;
};

export type PartChannelPayload = {
  channel: string;
};

export type ClientMessageRegistry = {
  [MESSAGE_LOGIN]: LoginPayload;
  [MESSAGE_JOIN_CHANNEL]: JoinChannelPayload;
  [MESSAGE_SEND_MESSAGE]: SendMessagePayload;
  [MESSAGE_PART_CHANNEL]: PartChannelPayload;
};

export type ClientMessage = {
  [K in keyof ClientMessageRegistry]: Message<K, ClientMessageRegistry[K]>;
}[keyof ClientMessageRegistry];
