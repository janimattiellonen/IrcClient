import type { ServerEvent } from 'shared/protocol';
import type { ParsedIrcMessage } from './IrcProtocol';
import {
  serverChannelUserList,
  serverChannelUserJoin,
  serverChannelUserMessage,
  serverChannelUserPart,
  serverChannelTopic,
  genericServerMessage,
  serverError,
  serverPrivateMessage,
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
        case '332': {
          const channel = parsed.params[0];
          const topic = parsed.trailing || parsed.params.slice(1).join(' ');
          return serverChannelTopic({ channel, topic });
        }
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
          if (!result) return null;

          if (result.channel.startsWith('#')) {
            return serverChannelUserMessage(result);
          }

          return serverPrivateMessage({
            sender: result.user,
            recipient: result.channel,
            message: result.message,
          });
        }
        case 'TOPIC': {
          const channel = parsed.params[0];
          const topic = parsed.trailing || parsed.params.slice(1).join(' ');
          return serverChannelTopic({ channel, topic, changedBy: parsed.user.nick });
        }
        case 'PART': {
          const channel = parsed.params[0];
          return serverChannelUserPart({ channel, user: parsed.user });
        }
        default:
          return null;
      }
    }
  }
}
