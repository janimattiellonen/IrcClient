export type ChannelMessage = {
  id: string;
  timestamp: Date;
  channelName: string;
  source: string;
  message: string;
};

export type User = {
  nick: string;
  user: string;
  host: string;
}

export type Channel = {
  name: string;
  messages: ChannelMessage[];
  users: User[]
};

type ChannelRegistry = {
  [key: string]: Channel;
};

export class ChannelManager {
  private channels: ChannelRegistry;
  private activeChannel: Channel | null = null;

  constructor() {
    this.channels = {};
    this.activeChannel = null;
  }

  /**
   * @param channelName
   * @return ChannelButton the active channel
   * @throws Error if no channel is found matching channelName argument
   */
  setActiveChannel(channelName: string): Channel {
    if (!this.channels[channelName]) {
      throw new Error(`No channel found with the name ${channelName}`);
    }

    const channel = this.channels[channelName];

    this.activeChannel = channel;

    return channel;
  }

  clearActiveChannel(): void {
    this.activeChannel = null;
  }

  /**
   * @param channel
   * @return void
   * @throws Error if a channel wit the same name has already been added
   */
  addChannel(channel: Channel): void {
    if (this.channels[channel.name]) {
      throw new Error(`Channel ${channel.name} already exists`);
    }

    this.channels[channel.name] = channel;
  }

  getActiveChannel(): Channel | null {
    return this.activeChannel;
  }

  getChannel(channelName: string): Channel | null {
    return this.channels[channelName] || null;
  }

  getChannels(): Channel[] {
    return Object.values(this.channels);
  }

  removeChannel(channelName: string): void {
    if (!this.channels[channelName]) {
      throw new Error(`Channel ${channelName} does not exist`);
    }

    // React state might not see this change
    delete this.channels[channelName];

    const channels = this.getChannels();

    if (channels.length > 0) {
      this.setActiveChannel(channels[0].name);
    } else {
      this.clearActiveChannel();
    }
  }
}
