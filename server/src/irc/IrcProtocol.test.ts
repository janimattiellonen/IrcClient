import { describe, it, expect } from 'vitest';
import { formatTimestamp } from '../utils/formatters';

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
    const foo = IrcProtocol.parseCommand('PING jme');

    expect(foo.command).toBe('PING');
    expect(foo.params).toEqual(['jme']);
  });
});

describe('isServerCommand', () => {
  it('should return true', () => {
    const foo = IrcProtocol.isServerCommand('PING jme');

    expect(foo).toBe(true);
  });

  it('should return false', () => {
    const foo = IrcProtocol.isServerCommand(':ergo.test 255 jme :I have 2 clients and 0 servers');

    expect(foo).toBe(false);
  });
});

describe('parseChannelUserList', () => {
  it('should return a parsed user channel list', () => {
    const foo = IrcProtocol.parseChannelUserList(':ergo.test 353 jme = #foo :Guest67 jme');

    expect(foo).toBe({});
  });

  it('should return false', () => {
    const foo = IrcProtocol.isServerCommand(':ergo.test 255 jme :I have 2 clients and 0 servers');

    expect(foo).toBe(false);
  });
});

describe('parseHost', () => {
  it('should return a parsed host', () => {
    const host = IrcProtocol.parseHost(':ergo.test 353 jme = #foo :Guest67 jme');

    expect(host).toBe('ergo.test');
  });
});

describe('parseUser', () => {
  it('should return a parsed user', () => {
    const user = IrcProtocol.parseUser(':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3');

    const expected = {
      nick: 'Guest67',
      user: '~u',
      host: 'epmw7nfq4pm9w.irc',
    }

    expect(user).toEqual(expected);
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
    const status = IrcProtocol.hasUser(':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3');

    expect(status).toEqual(true);
  });

  it('should not have a user part', () => {
    const status = IrcProtocol.hasUser(':ergo.test 353 jme = #foo :Guest67 jme');

    expect(status).toEqual(false);
  });
});

describe('hasHost', () => {
  it('should have a host part', () => {
    const status = IrcProtocol.hasHost(':ergo.test 353 jme = #foo :Guest67 jme');

    expect(status).toEqual(true);
  });

  it('should not have a host part', () => {
    const status = IrcProtocol.hasHost(':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3');

    expect(status).toEqual(false);
  });
});

