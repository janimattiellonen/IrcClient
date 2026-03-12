import { isIrcCommand, parseIrcCommand } from './irc.ts';
import type { ClientMessage } from '../../../shared/protocol';
import { COMMAND_JOIN, COMMAND_PART, COMMAND_PRIVMSG } from '../../../shared/commandTypes.ts';
import { joinChannelMessage, partChannelMessage, sendMessageMessage, sendPrivateMessageMessage } from '../messages/messages.ts';

export function handleInput(
  input: string,
  sendMessage: (message: ClientMessage) => void,
  activeConversationName: string | null,
  activeConversationKind: 'channel' | 'private' | null
) {
  if (isIrcCommand(input)) {
    const command = parseIrcCommand(input);

    if (command.type === COMMAND_JOIN && command.payload.channel) {
      sendMessage(joinChannelMessage(command.payload.channel));
    } else if (command.type === COMMAND_PART) {
      const channel = command.payload.channel ?? activeConversationName;
      if (channel) {
        sendMessage(partChannelMessage(channel));
      }
    } else if (command.type === COMMAND_PRIVMSG) {
      sendMessage(sendPrivateMessageMessage(command.payload.recipient, command.payload.message));
    }
  } else if (activeConversationName) {
    if (activeConversationKind === 'private') {
      sendMessage(sendPrivateMessageMessage(activeConversationName, input));
    } else {
      sendMessage(sendMessageMessage(activeConversationName, input));
    }
  }
}
