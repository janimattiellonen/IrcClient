import { isIrcCommand, parseIrcCommand } from './irc.ts';
import { handleIrcCommand } from './command-handler.ts';

export function handleInput(input: string) {
  if (isIrcCommand(input)) {
    const command = parseIrcCommand(input);

      handleIrcCommand(command);

  }

}