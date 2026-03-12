import {
  type JoinChannelPayload,
  type LoginPayload,
  type Message,
  type PartChannelPayload,
  type SendMessagePayload,
  MESSAGE_JOIN_CHANNEL,
  MESSAGE_LOGIN,
  MESSAGE_PART_CHANNEL,
  MESSAGE_SEND_MESSAGE,
} from '../../../shared/protocol';

export function loginMessage(
  nickname: string,
  server: string,
  port: number
): Message<typeof MESSAGE_LOGIN, LoginPayload> {
  return {
    type: MESSAGE_LOGIN,
    payload: { nickname, server, port },
  };
}

export function joinChannelMessage(
  channel: string
): Message<typeof MESSAGE_JOIN_CHANNEL, JoinChannelPayload> {
  return {
    type: MESSAGE_JOIN_CHANNEL,
    payload: { channel },
  };
}

export function partChannelMessage(
  channel: string
): Message<typeof MESSAGE_PART_CHANNEL, PartChannelPayload> {
  return {
    type: MESSAGE_PART_CHANNEL,
    payload: { channel },
  };
}

export function sendMessageMessage(
  channel: string,
  message: string
): Message<typeof MESSAGE_SEND_MESSAGE, SendMessagePayload> {
  return {
    type: MESSAGE_SEND_MESSAGE,
    payload: { channel, message },
  };
}
