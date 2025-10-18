
/**
 * Represents the prefix part of an IRC message
 * Format: servername | nick [ '!' user ] [ '@' host ]
 */
type IrcPrefix = {
  raw: string;
  servername?: string;
  nick?: string;
  user?: string;
  host?: string;
}

/**
 * Represents a parsed IRC protocol message
 */
type ParsedIrcMessage = {
  raw: string;
  prefix?: IrcPrefix;
  command: string; // Either a word command (e.g., 'PRIVMSG') or numeric reply (e.g., '001')
  params: string[]; // All parameters before the trailing
  trailing?: string; // The message after the final ':'
}

/**
 * Represents a parsed numeric reply with human-readable content
 */
type ParsedNumericReply = ParsedIrcMessage & {
  command: string; // Will be a numeric code like '001', '002', etc.
  target: string; // Usually the nickname, first parameter
  humanReadable: string; // The message meant for display
}
export const IrcProtocol = {
  isServerCommand: (data: string): boolean => {
    return data[0] !== ':';
  },
  formatNick: (nick: string): string => {
    return `NICK ${nick}\r\n`;
  },

  formatUser: (username: string, realname: string): string => {
    return `USER ${username} 0 * :${realname}\r\n`;
  },

  formatPong: (message: string): string => {
    return `PONG ${message}\r\n`;
  },

  parseCommand: (message: string): any => {
    const parts = message.split(' ');

    return {
      command: parts[0],
      params: parts.splice(1, parts.length)
    }
  },

  parseMessage: (message: string): any => {
    console.log(`parseMessage: ${message}`);

    // PING jme
    // :ergo.test 001 jme :Welcome to the ErgoTest IRC Network jme
    // :ergo.test 004 jme ergo.test ergo-2.16.0-e200e9fd8f13cf46 BERTZios CEIMRUabefhiklmnoqstuv Iabefhkloqv
    // :ergo.test 005 jme TOPICLEN=390 UTF8ONLY WHOX draft/CHATHISTORY=1000 :are supported by this server

    const firstColon = message.indexOf(':');
    const host = message.substring(firstColon, message.indexOf(' '));

    const replyCode = message.substring(host.length + 1, message.indexOf(' ', host.length + 2));

    const serverMessage = message.substring(message.indexOf(':', host.length + 2) + 1);

    return {
      command: null,
      replyCode: replyCode,
      serverMessage: serverMessage,
    }
  }
}