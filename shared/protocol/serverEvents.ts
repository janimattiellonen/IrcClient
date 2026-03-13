import type { Message, User } from './types';

export const SERVER_MESSAGE_CHANNEL_USER_LIST = 'SERVER_MESSAGE_CHANNEL_USER_LIST' as const;
export const SERVER_MESSAGE_CHANNEL_USER_JOIN = 'SERVER_MESSAGE_CHANNEL_USER_JOIN' as const;
export const SERVER_MESSAGE_CHANNEL_USER_MESSAGE = 'SERVER_MESSAGE_CHANNEL_USER_MESSAGE' as const;
export const SERVER_MESSAGE_GENERIC_MESSAGE = 'SERVER_MESSAGE_GENERIC_MESSAGE' as const;
export const SERVER_MESSAGE_CHANNEL_USER_PART = 'SERVER_MESSAGE_CHANNEL_USER_PART' as const;
export const SERVER_MESSAGE_CHANNEL_TOPIC = 'SERVER_MESSAGE_CHANNEL_TOPIC' as const;
export const SERVER_MESSAGE_ERROR = 'SERVER_MESSAGE_ERROR' as const;
export const SERVER_MESSAGE_PRIVATE_MESSAGE = 'SERVER_MESSAGE_PRIVATE_MESSAGE' as const;
export const SERVER_MESSAGE_NICK_CHANGE = 'SERVER_MESSAGE_NICK_CHANGE' as const;

export type ServerMessagePayload = {
  host: string;
  replyCode?: string | null;
};

export type ChannelUserListEntry = {
  nick: string;
  prefix: string;
};

export type ChannelUserListPayload = ServerMessagePayload & {
  channelType: string;
  channel: string;
  nicks: ChannelUserListEntry[];
};

export type ChannelUserJoinPayload = {
  channel: string;
  user: User;
};

export type ChannelUserMessagePayload = {
  channel: string;
  user: User;
  message: string;
};

export type ChannelUserPartPayload = {
  channel: string;
  user: User;
};

export type ChannelTopicPayload = {
  channel: string;
  topic: string;
  changedBy?: string;
};

export type GenericServerMessagePayload = ServerMessagePayload & {
  message: string;
};

export type ErrorPayload = {
  code?: string;
  message: string;
};

export type PrivateMessagePayload = {
  sender: User;
  recipient: string;
  message: string;
};

export type NickChangePayload = {
  oldNick: string;
  newNick: string;
};

export type ServerEventRegistry = {
  [SERVER_MESSAGE_CHANNEL_USER_LIST]: ChannelUserListPayload;
  [SERVER_MESSAGE_CHANNEL_USER_JOIN]: ChannelUserJoinPayload;
  [SERVER_MESSAGE_CHANNEL_USER_MESSAGE]: ChannelUserMessagePayload;
  [SERVER_MESSAGE_CHANNEL_USER_PART]: ChannelUserPartPayload;
  [SERVER_MESSAGE_CHANNEL_TOPIC]: ChannelTopicPayload;
  [SERVER_MESSAGE_GENERIC_MESSAGE]: GenericServerMessagePayload;
  [SERVER_MESSAGE_ERROR]: ErrorPayload;
  [SERVER_MESSAGE_PRIVATE_MESSAGE]: PrivateMessagePayload;
  [SERVER_MESSAGE_NICK_CHANGE]: NickChangePayload;
};

export type ServerEvent = {
  [K in keyof ServerEventRegistry]: Message<K, ServerEventRegistry[K]>;
}[keyof ServerEventRegistry];
