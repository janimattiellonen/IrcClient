import { describe, it, expect } from 'vitest';

import { IrcProtocol } from './IrcProtocol';

describe('formatNick', () => {
  it('should format an expected nick command', () => {
    expect(IrcProtocol.formatNick('jme')).toBe('NICK jme\r\n');
  });
});

describe('formatUser', () => {
  it('should format an expected user command', () => {
    expect(IrcProtocol.formatUser('jme', 'jme')).toBe('USER jme 0 * :jme\r\n');
  });
});

describe('parseCommand', () => {
  it('should return command and params', () => {
    const result = IrcProtocol.parseCommand('PING jme');

    expect(result.kind).toBe('command');
    expect(result.command).toBe('PING');
    expect(result.params).toEqual(['jme']);
  });
});

describe('isServerCommand', () => {
  it('should return true', () => {
    expect(IrcProtocol.isServerCommand('PING jme')).toBe(true);
  });

  it('should return false', () => {
    expect(IrcProtocol.isServerCommand(':ergo.test 255 jme :I have 2 clients and 0 servers')).toBe(false);
  });
});

describe('parseChannelUserList', () => {
  it('should return a parsed user channel list', () => {
    const result = IrcProtocol.parseChannelUserList(':ergo.test 353 jme = #foo :Guest67 jme');

    expect(result.host).toBe('ergo.test');
    expect(result.replyCode).toBe('353');
    expect(result.channelType).toBe('=');
    expect(result.channel).toBe('#foo');
    expect(result.nicks).toEqual([
      { nick: 'Guest67', prefix: '' },
      { nick: 'jme', prefix: '' },
    ]);
  });

  it('should separate mode prefixes from nicks', () => {
    const result = IrcProtocol.parseChannelUserList(':ergo.test 353 jme = #foo :@OpUser +VoiceUser NormalUser');

    expect(result.nicks).toEqual([
      { nick: 'OpUser', prefix: '@' },
      { nick: 'VoiceUser', prefix: '+' },
      { nick: 'NormalUser', prefix: '' },
    ]);
  });
});

describe('parseServerHost', () => {
  it('should return a parsed server host', () => {
    const host = IrcProtocol.parseServerHost(':ergo.test 353 jme = #foo :Guest67 jme');

    expect(host).toBe('ergo.test');
  });
});

describe('parseUser', () => {
  it('should return a parsed user', () => {
    const user = IrcProtocol.parseUser(':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3');

    expect(user).toEqual({
      nick: 'Guest67',
      user: '~u',
      host: 'epmw7nfq4pm9w.irc',
    });
  });
});

describe('parseReplyCode', () => {
  it('should return parsed reply code', () => {
    const parseReplyCode = IrcProtocol.parseReplyCode(':ergo.test 353 jme = #foo :Guest67 jme');

    expect(parseReplyCode).toBe('353');
  });
});

describe('hasUser', () => {
  it('should have a user part', () => {
    expect(IrcProtocol.hasUser(':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3')).toBe(true);
  });

  it('should not have a user part', () => {
    expect(IrcProtocol.hasUser(':ergo.test 353 jme = #foo :Guest67 jme')).toBe(false);
  });
});

describe('hasServerHost', () => {
  it('should have a server host part', () => {
    expect(IrcProtocol.hasServerHost(':ergo.test 353 jme = #foo :Guest67 jme')).toBe(true);
  });

  it('should not have a host part', () => {
    expect(IrcProtocol.hasServerHost(':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3')).toBe(false);
  });
});

describe('parseUserChannelJoin', () => {
  it('should return a parsed channel join object', () => {
    const channelJoin = IrcProtocol.parseUserChannelJoin(':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3');

    expect(channelJoin).toEqual({
      user: {
        nick: 'Guest67',
        user: '~u',
        host: 'epmw7nfq4pm9w.irc',
      },
      channel: '#foo3',
    });
  });
});

describe('parseChannelMessage', () => {
  it('should return a parsed channel message object', () => {
    const channelMessage = IrcProtocol.parseChannelMessage(':Guest67!~u@epmw7nfq4pm9w.irc PRIVMSG #foo3 :Hi there!');

    expect(channelMessage).toEqual({
      user: {
        nick: 'Guest67',
        user: '~u',
        host: 'epmw7nfq4pm9w.irc',
      },
      channel: '#foo3',
      message: 'Hi there!',
    });
  });
});

describe('parseMessage', () => {
  it('should parse a PING command', () => {
    const result = IrcProtocol.parseMessage('PING jme');

    expect(result).toEqual({
      kind: 'command',
      command: 'PING',
      params: ['jme'],
    });
  });

  it('should parse a server numeric reply', () => {
    const result = IrcProtocol.parseMessage(':ergo.test 001 jme :Welcome to the ErgoTest IRC Network jme');

    expect(result).toEqual({
      kind: 'server',
      host: 'ergo.test',
      replyCode: '001',
      target: 'jme',
      params: [],
      trailing: 'Welcome to the ErgoTest IRC Network jme',
    });
  });

  it('should parse a user JOIN message', () => {
    const result = IrcProtocol.parseMessage(':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3');

    expect(result).toEqual({
      kind: 'user',
      user: { nick: 'Guest67', user: '~u', host: 'epmw7nfq4pm9w.irc' },
      command: 'JOIN',
      params: ['#foo3'],
      trailing: '',
    });
  });

  it('should parse a user PRIVMSG', () => {
    const result = IrcProtocol.parseMessage(':Guest67!~u@epmw7nfq4pm9w.irc PRIVMSG #foo3 :Hi there!');

    expect(result).toEqual({
      kind: 'user',
      user: { nick: 'Guest67', user: '~u', host: 'epmw7nfq4pm9w.irc' },
      command: 'PRIVMSG',
      params: ['#foo3'],
      trailing: 'Hi there!',
    });
  });
});
