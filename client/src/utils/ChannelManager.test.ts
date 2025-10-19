import { describe, it, expect, beforeEach } from 'vitest';
import { ChannelManager } from './ChannelManager.ts';

describe('ChannelManager', () => {
  let channelManager = new ChannelManager();

  beforeEach(() => {
    channelManager = new ChannelManager();
  });

  it('sets active channel', () => {
    channelManager['channels'] = {
      '#foo': {
        name: '#foo',
        messages: [],
      },
    };

    const activeChannel = channelManager.setActiveChannel('#foo');

    expect(activeChannel).not.toBeNull();
    expect(activeChannel.name).to.equal('#foo');
  });

  it('returns active channel', () => {
    channelManager['activeChannel'] = {
      name: '#foo',
      messages: [],
    };

    const activeChannel = channelManager.getActiveChannel();

    expect(activeChannel).not.toBeNull();
    expect(activeChannel!.name).to.equal('#foo');
  });

  it('adds a new channel', () => {
    const channel = {
      name: '#foo',
      messages: [],
    };

    channelManager.addChannel(channel);

    expect(channelManager['channels']['#foo'].name).to.equal('#foo');
  });

  it('cannot add a channel that has already been added', () => {
    const channel = {
      name: '#foo',
      messages: [],
    };

    channelManager.addChannel(channel);

    expect(() => channelManager.addChannel(channel))
      .toThrowError('Channel #foo already exists');
  });

  it('gets channel', () => {
    channelManager['channels'] = {
      '#foo': {
        name: '#foo',
        messages: [],
      },
    };

    const channel = channelManager.getChannel('#foo');

    expect(channel).not.toBeNull();
    expect(channel!.name).to.equal('#foo');
  })

  it('gets all channels', () => {
    channelManager['channels'] = {
      '#foo': {
        name: '#foo',
        messages: [],
      },
      '#bar': {
        name: '#bar',
        messages: [],
      },
    };

    const channels = channelManager.getChannels();

    expect(channels.length).to.equal(2);

    expect(channels[0].name).to.equal('#foo');
    expect(channels[1].name).to.equal('#bar');
  })

  it('gets no channel', () => {
    channelManager['channels'] = {
      '#foo': {
        name: '#foo',
        messages: [],
      },
    };

    const channel = channelManager.getChannel('#foos');

    expect(channel).toBeNull();
  })

  it('deletes a previously added channel', () => {
    channelManager['channels'] = {
      '#foo': {
        name: '#foo',
        messages: [],
      },
    };

    channelManager.removeChannel('#foo');

    expect(channelManager['channels']).toStrictEqual({});
  })

  it('cannot delete a non-existing channel', () => {
    channelManager['channels'] = {
      '#foo': {
        name: '#foo',
        messages: [],
      },
    };

    expect(() => channelManager.removeChannel('#foos'))
      .toThrowError('Channel #foos does not exist');
  })
});