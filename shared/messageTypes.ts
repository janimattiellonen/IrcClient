export type Message<T extends string, P> = {
  type: T;
  payload: P;
};

export const MESSAGE_JOIN_CHANNEL = 'JOIN_CHANNEL';
export const MESSAGE_LOGIN = 'LOGIN';
export const MESSAGE_GENERIC_MESSAGE = 'GENERIC_MESSAGE';

export const SERVER_MESSAGE_CHANNEL_USER_LIST = 'SERVER_MESSAGE_CHANNEL_USER_LIST';

export const SERVER_MESSAGE_CHANNEL_USER_JOIN = 'SEVER_MESSAGE_CHANNEL_USER_JOIN';

export const SERVER_MESSAGE_GENERIC_MESSAGE = 'SERVER_MESSAGE_GENERIC_MESSAGE';

export type LoginPayload = {
  nickname: string;
  server: string;
  port: number;
};

export type JoinChannelPayload = {
  channel: string;
};

export type GenericMessagePayload = {
  message: string;
};

export type ServerMessagePayload = {
  host: string;
  replyCode?: string | null;
};

export type ChannelUserListServerMessagePayload = ServerMessagePayload & {
  channelType: string;
  channel: string;
  nicks: string[];
};

export type ChannelUserJoinServerMessagePayload = {
  channel: string;
  user: {
    nick: string;
    user: string;
    host: string;
  }
};

export type GenericServerMessagePayload = ServerMessagePayload & {
  message: string;
};

export type MessageRegistry = {
  [MESSAGE_LOGIN]: LoginPayload;
  [MESSAGE_JOIN_CHANNEL]: JoinChannelPayload;
  [MESSAGE_GENERIC_MESSAGE]: GenericMessagePayload;
  [SERVER_MESSAGE_CHANNEL_USER_LIST]: ChannelUserListServerMessagePayload;
  [SERVER_MESSAGE_CHANNEL_USER_JOIN]: ChannelUserJoinServerMessagePayload,
  [SERVER_MESSAGE_GENERIC_MESSAGE]: GenericServerMessagePayload;
};

export type AppMessage = {
  [K in keyof MessageRegistry]: Message<K, MessageRegistry[K]>;
}[keyof MessageRegistry];
