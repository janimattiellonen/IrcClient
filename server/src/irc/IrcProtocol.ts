import { Channel } from 'node:diagnostics_channel';
import { serverChannelUserList, serverChannelUserJoin, genericServerMessage } from '../messages/serverMessages';

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
};

type User = {
  nick: string;
  user: string;
  host: string;
}

type ChannelJoin = {
  user: User;
  channel: string;
}

type ServerMessageResponse = {
  replyCode: string;
  serverMessage: string;
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
};

/**
 * Represents a parsed numeric reply with human-readable content
 */
type ParsedNumericReply = ParsedIrcMessage & {
  command: string; // Will be a numeric code like '001', '002', etc.
  target: string; // Usually the nickname, first parameter
  humanReadable: string; // The message meant for display
};

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
      params: parts.splice(1, parts.length),
    };
  },

  parseMessage: (message: string): ServerMessageResponse | any => {
    console.log(`parseMessage: ${message}`);

    // PING jme
    // :ergo.test 001 jme :Welcome to the ErgoTest IRC Network jme
    // :ergo.test 004 jme ergo.test ergo-2.16.0-e200e9fd8f13cf46 BERTZios CEIMRUabefhiklmnoqstuv Iabefhkloqv
    // :ergo.test 005 jme TOPICLEN=390 UTF8ONLY WHOX draft/CHATHISTORY=1000 :are supported by this server
    // :ergo.test 353 jme = #foo :Guest67 jme
    // :jme!~u@epmw7nfq4pm9w.irc JOIN #bar
    // :jme!~u@epmw7nfq4pm9w.irc PART #bar

    if (IrcProtocol.hasServerHost(message)) {
      //const host = message.substring(firstColon, message.indexOf(' '));
      const host = IrcProtocol.parseServerHost(message);

      //const replyCode = message.substring(host.length + 1, message.indexOf(' ', host.length + 2));
      const replyCode = IrcProtocol.parseReplyCode(message);

      const serverMessage = message.substring(message.indexOf(':', host.length + 2) + 1);

      switch (replyCode) {
        case '353': {
          return serverChannelUserList(IrcProtocol.parseChannelUserList(message));
        }
      }

      return genericServerMessage( {
        host,
        replyCode,
        serverMessage,
      })

    } else if (IrcProtocol.hasUser(message)) {
      const user = IrcProtocol.parseUser(message);

      if (!user) {
        return null;
      }

      const parts = message.split(' ');

      if (parts.length < 3) {
        return null;
      }

      switch (parts[1].toUpperCase()) {
        case 'JOIN': {
          const result = IrcProtocol.parseUserChannelJoin(message);

          return result ? serverChannelUserJoin(result) : null;
        }
        case 'PART': {
          // return IrcProtocol.parseUserChannelPart(message);
          break;
        }
      }

      // :jme4!~u@epmw7nfq4pm9w.irc JOIN #foo3
      // :Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3
    }

    return null;
  },

  hasServerHost(message: string): boolean {
    if (IrcProtocol.isServerCommand(message)) {
      return false;
    }

    const parts = message.split(' ');

    if (parts.length > 0) {
      if (parts[0].indexOf('@') === -1 && parts[1].indexOf('!') === -1) {
        return true;
      }
    }

    return false;
  },

  hasUser(message: string): boolean {
    if (IrcProtocol.isServerCommand(message)) {
      return false;
    }

    const parts = message.split(' ');

    if (parts.length > 0) {
      if (parts[0].indexOf('@') !== -1 && parts[0].indexOf('!') !== -1) {
        return true;
      }
    }

    return false;
  },

  parseServerHost(message: string): string {
    const firstColon = message.indexOf(':');
    return message.substring(firstColon + 1, message.indexOf(' '));
  },

  parseUser(message: string): User | null  {
    if (!IrcProtocol.hasUser(message)) {
      return null;
    }

    const nick = message.substring(1, message.indexOf('!'));
    const user = message.substring(message.indexOf('!') + 1, message.indexOf('@'));

    return {
      nick,
      user,
      host: message.substring(message.indexOf('@') + 1, message.indexOf(' ')),
    }
  },

  parseUserChannelJoin(message: string): ChannelJoin | null {
    // :jme4!~u@epmw7nfq4pm9w.irc JOIN #foo3
    if (!IrcProtocol.hasUser(message)) {
      return null;
    }

    const user = IrcProtocol.parseUser(message);

    if (!user) {
      return null;
    }

    const parts = message.split(' ');

    if (parts.length < 3) {
      return null;
    }

    return {
      user: user,
      channel: parts[2]
    }
  },

  parseReplyCode(message: string): string {
    const host = IrcProtocol.parseServerHost(message);
    return message.substring(host.length + 2, message.indexOf(' ', host.length + 2));
  },

  // Reply code: 353
  parseChannelUserList(message: string) {
    // :ergo.test 353 jme = #foo :Guest67 jme
    const firstColon = message.indexOf(':');
    const host = IrcProtocol.parseServerHost(message);
    //const replyCode = message.substring(host.length + 1, message.indexOf(' ', host.length + 2));
    const replyCode = IrcProtocol.parseReplyCode(message);
    const nick = message.substring(
      firstColon + host.length + 2 + replyCode.length,
      message.indexOf(' ', firstColon + host.length + 2 + replyCode.length),
    );

    const rest = message.substring(
      firstColon + host.length + 2 + replyCode.length + nick.length + 1,
    );

    const channelType = rest.substring(0, 1);

    const channel = rest.substring(2, rest.indexOf(' ', channelType.length + 1));

    const nicks = rest.substring(rest.indexOf(':') + 1).split(' ');

    return {
      host,
      replyCode,
      nick,
      rest,
      channelType,
      channel,
      nicks,
    };

    /*
       '=': public channel
       '@': secret channel
       '*': private channel
     */
    //const channelType
  },
};
