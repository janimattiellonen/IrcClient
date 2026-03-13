export type IrcUser = {
  nick: string;
  user: string;
  host: string;
};

export type ParsedServerMessage = {
  kind: 'server';
  host: string;
  replyCode: string;
  target: string;
  params: string[];
  trailing: string;
};

export type ParsedUserMessage = {
  kind: 'user';
  user: IrcUser;
  command: string;
  params: string[];
  trailing: string;
};

export type ParsedCommand = {
  kind: 'command';
  command: string;
  params: string[];
};

export type ParsedIrcMessage = ParsedServerMessage | ParsedUserMessage | ParsedCommand;

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

  parseCommand: (message: string): ParsedCommand => {
    const parts = message.split(' ');

    return {
      kind: 'command',
      command: parts[0],
      params: parts.slice(1),
    };
  },

  /**
   * Parse a raw IRC message into a structured object.
   * Returns null for messages that cannot be parsed.
   *
   * IRC message format (RFC 2812):
   *   [:prefix] command [params] [:trailing]
   *
   * Examples:
   *   PING jme
   *   :ergo.test 001 jme :Welcome to the ErgoTest IRC Network jme
   *   :ergo.test 353 jme = #foo :Guest67 jme
   *   :jme!~u@epmw7nfq4pm9w.irc JOIN #bar
   *   :Guest67!~u@epmw7nfq4pm9w.irc PRIVMSG #foo3 :Hi there!
   */
  parseMessage: (message: string): ParsedIrcMessage | null => {
    if (IrcProtocol.isServerCommand(message)) {
      return IrcProtocol.parseCommand(message);
    }

    // Extract trailing (text after the last " :" in the message)
    let trailing = '';
    let remainder = message;
    const trailingIndex = message.indexOf(' :');
    if (trailingIndex !== -1) {
      trailing = message.substring(trailingIndex + 2);
      remainder = message.substring(0, trailingIndex);
    }

    // Split: prefix, command, params...
    const parts = remainder.split(' ');
    const prefix = parts[0].substring(1); // remove leading ':'

    if (parts.length < 2) {
      return null;
    }

    // Determine if prefix is a user (nick!user@host) or server host
    if (prefix.includes('!') && prefix.includes('@')) {
      const user = IrcProtocol.parseUser(message);

      if (!user) {
        return null;
      }

      return {
        kind: 'user',
        user,
        command: parts[1].toUpperCase(),
        params: parts.slice(2),
        trailing,
      };
    }

    // Server message: :ergo.test 001 jme :Welcome...
    const command = parts[1];
    const target = parts.length > 2 ? parts[2] : '';
    const params = parts.slice(3);

    return {
      kind: 'server',
      host: prefix,
      replyCode: command,
      target,
      params,
      trailing,
    };
  },

  hasServerHost(message: string): boolean {
    if (IrcProtocol.isServerCommand(message)) {
      return false;
    }

    const parts = message.split(' ');

    if (parts.length > 0) {
      if (!parts[0].includes('@') && !parts[0].includes('!')) {
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
      if (parts[0].includes('@') && parts[0].includes('!')) {
        return true;
      }
    }

    return false;
  },

  parseServerHost(message: string): string {
    return message.substring(1, message.indexOf(' '));
  },

  parseUser(message: string): IrcUser | null {
    if (!IrcProtocol.hasUser(message)) {
      return null;
    }

    const nick = message.substring(1, message.indexOf('!'));
    const user = message.substring(message.indexOf('!') + 1, message.indexOf('@'));

    return {
      nick,
      user,
      host: message.substring(message.indexOf('@') + 1, message.indexOf(' ')),
    };
  },

  parseUserChannelJoin(message: string): { user: IrcUser; channel: string } | null {
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
      user,
      channel: parts[2],
    };
  },

  parseReplyCode(message: string): string {
    const host = IrcProtocol.parseServerHost(message);
    return message.substring(host.length + 2, message.indexOf(' ', host.length + 2));
  },

  parseChannelMessage(message: string): { user: IrcUser; channel: string; message: string } | null {
    if (!IrcProtocol.hasUser(message)) {
      return null;
    }

    const user = IrcProtocol.parseUser(message);

    if (!user) {
      return null;
    }

    const parts = message.split(' ');

    if (parts.length < 4) {
      return null;
    }

    const channelName = parts[2];
    const channelMessage = message.substring(message.indexOf(':', 1) + 1);

    return {
      user,
      channel: channelName,
      message: channelMessage,
    };
  },

  parseChannelUserList(message: string): {
    host: string;
    replyCode: string;
    channelType: string;
    channel: string;
    nicks: { nick: string; prefix: string }[];
  } {
    // :ergo.test 353 jme = #foo :Guest67 jme
    const host = IrcProtocol.parseServerHost(message);
    const replyCode = IrcProtocol.parseReplyCode(message);

    // After ":host replyCode target " we have "= #channel :nicks..."
    // Find the part after the target (nickname)
    const parts = message.split(' ');
    // parts[0] = :ergo.test, parts[1] = 353, parts[2] = jme, parts[3] = =, parts[4] = #foo, parts[5...] = :nicks
    const channelType = parts[3];
    const channel = parts[4];

    // Extract nicks from trailing (after the last ':')
    const trailingStart = message.indexOf(':', 1);
    const rawNicks = trailingStart !== -1 ? message.substring(trailingStart + 1).split(' ') : [];
    // Separate IRC mode prefixes (@=op, +=voice, %=halfop, ~=owner, &=admin) from nicks
    const nicks = rawNicks.map((raw) => {
      const match = raw.match(/^([~&@%+]*)(.+)$/);
      return match ? { nick: match[2], prefix: match[1] } : { nick: raw, prefix: '' };
    });

    return {
      host,
      replyCode,
      channelType,
      channel,
      nicks,
    };
  },
};
