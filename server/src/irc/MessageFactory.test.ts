import { describe, it, expect } from 'vitest';
import { toServerEvent } from './MessageFactory';
import type { ParsedServerMessage, ParsedUserMessage, ParsedCommand } from './IrcProtocol';

describe('toServerEvent', () => {
  it('should return null for command messages (PING)', () => {
    const parsed: ParsedCommand = {
      kind: 'command',
      command: 'PING',
      params: ['ergo.test'],
    };

    expect(toServerEvent(parsed, 'PING ergo.test')).toBeNull();
  });

  it('should convert a server 001 reply to generic server message', () => {
    const parsed: ParsedServerMessage = {
      kind: 'server',
      host: 'ergo.test',
      replyCode: '001',
      target: 'jme',
      params: [],
      trailing: 'Welcome to the ErgoTest IRC Network jme',
    };

    const result = toServerEvent(parsed, ':ergo.test 001 jme :Welcome to the ErgoTest IRC Network jme');

    expect(result).toEqual({
      type: 'SERVER_MESSAGE_GENERIC_MESSAGE',
      payload: {
        host: 'ergo.test',
        replyCode: '001',
        message: 'Welcome to the ErgoTest IRC Network jme',
      },
    });
  });

  it('should convert a 353 reply to channel user list', () => {
    const parsed: ParsedServerMessage = {
      kind: 'server',
      host: 'ergo.test',
      replyCode: '353',
      target: 'jme',
      params: ['=', '#foo'],
      trailing: 'Guest67 jme',
    };

    const result = toServerEvent(parsed, ':ergo.test 353 jme = #foo :Guest67 jme');

    expect(result).toEqual({
      type: 'SERVER_MESSAGE_CHANNEL_USER_LIST',
      payload: {
        host: 'ergo.test',
        replyCode: '353',
        channelType: '=',
        channel: '#foo',
        nicks: ['Guest67', 'jme'],
      },
    });
  });

  it('should convert a user JOIN to channel user join event', () => {
    const parsed: ParsedUserMessage = {
      kind: 'user',
      user: { nick: 'Guest67', user: '~u', host: 'epmw7nfq4pm9w.irc' },
      command: 'JOIN',
      params: ['#foo3'],
      trailing: '',
    };

    const result = toServerEvent(parsed, ':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3');

    expect(result).toEqual({
      type: 'SERVER_MESSAGE_CHANNEL_USER_JOIN',
      payload: {
        channel: '#foo3',
        user: { nick: 'Guest67', user: '~u', host: 'epmw7nfq4pm9w.irc' },
      },
    });
  });

  it('should convert a user PRIVMSG to channel message event', () => {
    const parsed: ParsedUserMessage = {
      kind: 'user',
      user: { nick: 'Guest67', user: '~u', host: 'epmw7nfq4pm9w.irc' },
      command: 'PRIVMSG',
      params: ['#foo3'],
      trailing: 'Hi there!',
    };

    const result = toServerEvent(parsed, ':Guest67!~u@epmw7nfq4pm9w.irc PRIVMSG #foo3 :Hi there!');

    expect(result).toEqual({
      type: 'SERVER_MESSAGE_CHANNEL_USER_MESSAGE',
      payload: {
        channel: '#foo3',
        user: { nick: 'Guest67', user: '~u', host: 'epmw7nfq4pm9w.irc' },
        message: 'Hi there!',
      },
    });
  });

  it('should return null for PART (not yet implemented)', () => {
    const parsed: ParsedUserMessage = {
      kind: 'user',
      user: { nick: 'jme', user: '~u', host: 'epmw7nfq4pm9w.irc' },
      command: 'PART',
      params: ['#foo3'],
      trailing: '',
    };

    expect(toServerEvent(parsed, ':jme!~u@epmw7nfq4pm9w.irc PART #foo3')).toBeNull();
  });
});
