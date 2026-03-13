import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationManager } from './ConversationManager.ts';
import type { Channel, PrivateConversation } from './ConversationManager.ts';

describe('ConversationManager', () => {
  let manager = new ConversationManager();

  beforeEach(() => {
    manager = new ConversationManager();
  });

  it('sets active conversation', () => {
    manager['conversations'] = {
      '#foo': {
        kind: 'channel',
        name: '#foo',
        messages: [],
        users: [],
      },
    };

    const active = manager.setActiveConversation('#foo');

    expect(active).not.toBeNull();
    expect(active.name).to.equal('#foo');
  });

  it('returns active conversation', () => {
    manager['activeConversation'] = {
      kind: 'channel',
      name: '#foo',
      messages: [],
      users: [],
    };

    const active = manager.getActiveConversation();

    expect(active).not.toBeNull();
    expect(active!.name).to.equal('#foo');
  });

  it('adds a new channel', () => {
    const channel: Channel = {
      kind: 'channel',
      name: '#foo',
      messages: [],
      users: [],
    };

    manager.addConversation(channel);

    expect(manager['conversations']['#foo'].name).to.equal('#foo');
  });

  it('adds a new private conversation', () => {
    const pm: PrivateConversation = {
      kind: 'private',
      name: 'someuser',
      messages: [],
    };

    manager.addConversation(pm);

    expect(manager['conversations']['someuser'].name).to.equal('someuser');
    expect(manager['conversations']['someuser'].kind).to.equal('private');
  });

  it('cannot add a conversation that has already been added', () => {
    const channel: Channel = {
      kind: 'channel',
      name: '#foo',
      messages: [],
      users: [],
    };

    manager.addConversation(channel);

    expect(() => manager.addConversation(channel)).toThrowError(
      'Conversation #foo already exists'
    );
  });

  it('gets conversation', () => {
    manager['conversations'] = {
      '#foo': {
        kind: 'channel',
        name: '#foo',
        messages: [],
        users: [],
      },
    };

    const conversation = manager.getConversation('#foo');

    expect(conversation).not.toBeNull();
    expect(conversation!.name).to.equal('#foo');
  });

  it('gets all conversations', () => {
    manager['conversations'] = {
      '#foo': {
        kind: 'channel',
        name: '#foo',
        messages: [],
        users: [],
      },
      '#bar': {
        kind: 'channel',
        name: '#bar',
        messages: [],
        users: [],
      },
    };

    const conversations = manager.getConversations();

    expect(conversations.length).to.equal(2);

    expect(conversations[0].name).to.equal('#foo');
    expect(conversations[1].name).to.equal('#bar');
  });

  it('gets no conversation', () => {
    manager['conversations'] = {
      '#foo': {
        kind: 'channel',
        name: '#foo',
        messages: [],
        users: [],
      },
    };

    const conversation = manager.getConversation('#foos');

    expect(conversation).toBeNull();
  });

  it('deletes a previously added conversation', () => {
    manager['conversations'] = {
      '#foo': {
        kind: 'channel',
        name: '#foo',
        messages: [],
        users: [],
      },
    };

    manager.removeConversation('#foo');

    expect(manager['conversations']).toStrictEqual({});
  });

  it('cannot delete a non-existing conversation', () => {
    manager['conversations'] = {
      '#foo': {
        kind: 'channel',
        name: '#foo',
        messages: [],
        users: [],
      },
    };

    expect(() => manager.removeConversation('#foos')).toThrowError(
      'Conversation #foos does not exist'
    );
  });

  it('renames a user in channel user lists', () => {
    manager['conversations'] = {
      '#foo': {
        kind: 'channel',
        name: '#foo',
        messages: [],
        users: [
          { nick: 'oldnick', prefix: '@', user: '~u', host: 'test.host' },
          { nick: 'other', prefix: '', user: '~u', host: 'test.host' },
        ],
      },
      '#bar': {
        kind: 'channel',
        name: '#bar',
        messages: [],
        users: [
          { nick: 'oldnick', prefix: '', user: '~u', host: 'test.host' },
        ],
      },
    };

    manager.renameUser('oldnick', 'newnick');

    const foo = manager.getConversation('#foo');
    const bar = manager.getConversation('#bar');

    expect(foo?.kind === 'channel' && foo.users[0].nick).toBe('newnick');
    expect(foo?.kind === 'channel' && foo.users[1].nick).toBe('other');
    expect(bar?.kind === 'channel' && bar.users[0].nick).toBe('newnick');
  });

  it('renames a private conversation', () => {
    manager['conversations'] = {
      'oldnick': {
        kind: 'private',
        name: 'oldnick',
        messages: [{ id: '1', timestamp: new Date(), conversationName: 'oldnick', source: 'oldnick', message: 'hi' }],
      },
    };

    manager.renameUser('oldnick', 'newnick');

    expect(manager.getConversation('oldnick')).toBeNull();
    const conv = manager.getConversation('newnick');
    expect(conv).not.toBeNull();
    expect(conv!.name).toBe('newnick');
    expect(conv!.messages).toHaveLength(1);
  });
});
