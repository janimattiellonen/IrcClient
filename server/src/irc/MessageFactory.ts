import type { ServerEvent } from 'shared/protocol';
import type { ParsedIrcMessage } from './IrcProtocol';
import {
  serverChannelUserList,
  serverChannelUserJoin,
  serverChannelUserMessage,
  genericServerMessage,
  serverError,
} from '../messages/serverMessages';
import { IrcProtocol } from './IrcProtocol';

/**
 * Converts a parsed IRC message into a ServerEvent for the client.
 * Returns null for messages that should not be forwarded (e.g., PING/PONG).
 */
export function toServerEvent(parsed: ParsedIrcMessage, raw: string): ServerEvent | null {
  switch (parsed.kind) {
    case 'command':
      // Server commands like PING are handled internally, not forwarded
      return null;

    case 'server': {
      // IRC error reply codes are 400-599
      const code = Number(parsed.replyCode);

      if (code >= 400 && code < 600) {
        return serverError({
          code: parsed.replyCode,
          message: parsed.trailing,
        });
      }

      switch (parsed.replyCode) {
        case '353': {
          const userList = IrcProtocol.parseChannelUserList(raw);
          return serverChannelUserList(userList);
        }
        default:
          return genericServerMessage({
            host: parsed.host,
            replyCode: parsed.replyCode,
            serverMessage: parsed.trailing,
          });
      }
    }

    case 'user': {
      switch (parsed.command) {
        case 'JOIN': {
          const result = IrcProtocol.parseUserChannelJoin(raw);
          return result ? serverChannelUserJoin(result) : null;
        }
        case 'PRIVMSG': {
          const result = IrcProtocol.parseChannelMessage(raw);
          return result ? serverChannelUserMessage(result) : null;
        }
        case 'PART': {
          // TODO: implement PART handling
          return null;
        }
        default:
          return null;
      }
    }
  }
}
