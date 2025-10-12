import type { InvalidCommand, IrcCommand } from '../../../shared/commandTypes.ts';

export function handleIrcCommand(command: IrcCommand | InvalidCommand) {
  console.log(`handleIrcCommand, command type: ${command.type}`);
}