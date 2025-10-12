import {
  type GenericMessagePayload,
  type JoinChannelPayload,
  type LoginPayload,
  type Message, MESSAGE_GENERIC_MESSAGE,
  MESSAGE_JOIN_CHANNEL,
  MESSAGE_LOGIN,
} from '../../../shared/messageTypes.ts';



export function loginMessage(
  nickname: string,
  server: string
): Message<typeof MESSAGE_LOGIN, LoginPayload> {
  return {
    type: MESSAGE_LOGIN,
    payload: { nickname, server }
  }
}

export function joinChannelMessage(
  channel: string
): Message<typeof MESSAGE_JOIN_CHANNEL, JoinChannelPayload> {
  return {
    type: MESSAGE_JOIN_CHANNEL,
    payload: { channel }
  }
}

export function genericMessage(
  message: string
): Message<typeof MESSAGE_GENERIC_MESSAGE, GenericMessagePayload> {
  return {
    type: MESSAGE_GENERIC_MESSAGE,
      payload: { message }
  }
}
