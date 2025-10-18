import { describe, it, expect } from 'vitest';
import { formatTimestamp } from '../utils/formatters';

import {IrcProtocol} from './IrcProtocol';

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

describe('parseMessage', () => {
  it('should return sss', () => {
   const foo = IrcProtocol.parseMessage('');

   expect(foo.command).toBe('PONG')
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

    expect(foo).toBe(true);
  });
});