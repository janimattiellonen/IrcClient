import type { IrcCommand, InvalidCommand } from '../../../shared/commandTypes.ts';
import { joinCommand, partCommand, privMsgCommand, invalidCommand } from '../commands/commands.ts';

export function isIrcCommand(input: string): boolean {
  const trimmed = input.trim();

  return trimmed.startsWith('/');
}

export function parseIrcCommand(rawInput: string): IrcCommand | InvalidCommand {
  const input = rawInput.trim();

  if (!isIrcCommand(input)) {
    return invalidCommand(rawInput);
  }

  if (input.toUpperCase().startsWith('/JOIN')) {
    return parseJoin(input);
  }

  if (input.toUpperCase().startsWith('/PART')) {
    return parsePart(input);
  }

  if (input.toUpperCase().startsWith('/PRIVMSG')) {
    return parsePrivMsg(input);
  }

  return invalidCommand(rawInput);
}

function parsePart(input: string): IrcCommand | InvalidCommand {
  const hashIndex = input.indexOf('#');
  const channel = hashIndex !== -1 ? input.substring(hashIndex).trim() : null;

  return partCommand(channel, input);
}

function parsePrivMsg(input: string): IrcCommand | InvalidCommand {
  // TODO: Implement proper PRIVMSG parsing
  // For now, returning placeholder values
  const recipient = 'doo';
  const message = 'foo';

  return privMsgCommand(recipient, message, input);
}

function parseJoin(input: string): IrcCommand | InvalidCommand {
  const hashIndex = input.indexOf('#');
  const channel = hashIndex !== -1 ? input.substring(hashIndex).trim() : null;

  return joinCommand(channel, input);
}
