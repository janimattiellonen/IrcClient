import { isIrcCommand, parseIrcCommand } from './irc.ts';
import type { AppMessage } from 'shared/messageTypes.ts';
import { COMMAND_JOIN } from 'shared/commandTypes.ts';
import { joinChannelMessage } from '../messages/messages.ts';

export function handleInput(input: string, sendMessage: (message: AppMessage) => void) {
  if (isIrcCommand(input)) {
    const command = parseIrcCommand(input);

    // handleIrcCommand(command);

    if (command.type === COMMAND_JOIN)
      if (command.payload.channel) {
        sendMessage(joinChannelMessage(command.payload.channel));
      }
  }
}
