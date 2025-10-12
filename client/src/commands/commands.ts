import {
  type Command,
  type JoinPayload,
  type PrivMsgPayload,
  type InvalidCommand,
  COMMAND_JOIN,
  COMMAND_PRIVMSG,
} from '../../../shared/commandTypes.ts';

export function joinCommand(
  channel: string | null,
  originalInput: string
): Command<typeof COMMAND_JOIN, JoinPayload> {
  return {
    type: COMMAND_JOIN,
    payload: { channel },
    originalInput,
    isValid: channel !== null,
  };
}

export function privMsgCommand(
  recipient: string,
  message: string,
  originalInput: string
): Command<typeof COMMAND_PRIVMSG, PrivMsgPayload> {
  return {
    type: COMMAND_PRIVMSG,
    payload: { recipient, message },
    originalInput,
    isValid: recipient.length > 0 && message.length > 0,
  };
}

export function invalidCommand(originalInput: string): InvalidCommand {
  return {
    type: 'INVALID',
    originalInput,
    isValid: false,
    payload: {},
  };
}
