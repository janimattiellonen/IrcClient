import { isIrcCommand, parseIrcCommand } from './irc.ts';
import type { ClientMessage } from '../../../shared/protocol';
import { COMMAND_JOIN, COMMAND_PART } from '../../../shared/commandTypes.ts';
import { joinChannelMessage, partChannelMessage, sendMessageMessage } from '../messages/messages.ts';

export function handleInput(
  input: string,
  sendMessage: (message: ClientMessage) => void,
  activeChannel: string | null
) {
  if (isIrcCommand(input)) {
    const command = parseIrcCommand(input);

    if (command.type === COMMAND_JOIN && command.payload.channel) {
      sendMessage(joinChannelMessage(command.payload.channel));
    } else if (command.type === COMMAND_PART) {
      const channel = command.payload.channel ?? activeChannel;
      if (channel) {
        sendMessage(partChannelMessage(channel));
      }
    }
  } else if (activeChannel) {
    sendMessage(sendMessageMessage(activeChannel, input));
  }
}
