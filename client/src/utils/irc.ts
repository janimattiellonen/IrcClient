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

  if (input.toUpperCase().startsWith('/PRIVMSG') || input.toUpperCase().startsWith('/MSG')) {
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
  // /msg <nick> <message> or /privmsg <nick> <message>
  const spaceIndex = input.indexOf(' ');
  if (spaceIndex === -1) {
    return invalidCommand(input);
  }

  const rest = input.substring(spaceIndex + 1).trim();
  const recipientEnd = rest.indexOf(' ');

  if (recipientEnd === -1) {
    return invalidCommand(input);
  }

  const recipient = rest.substring(0, recipientEnd);
  const message = rest.substring(recipientEnd + 1).trim();

  if (!recipient || !message) {
    return invalidCommand(input);
  }

  return privMsgCommand(recipient, message, input);
}

function parseJoin(input: string): IrcCommand | InvalidCommand {
  const hashIndex = input.indexOf('#');
  const channel = hashIndex !== -1 ? input.substring(hashIndex).trim() : null;

  return joinCommand(channel, input);
}
