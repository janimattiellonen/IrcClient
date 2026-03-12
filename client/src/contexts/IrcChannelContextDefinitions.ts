import { createContext } from 'react';
import type { Channel, ChannelMessage, User } from '../utils/ChannelManager.ts';

export type IrcChannelContextType = {
  channels: Channel[];
  activeChannel: Channel | null;
  channelsWithUnread: Set<string>;
  addChannel: (channel: Channel) => void;
  addUserToChannel: (user: User, channelName: string) => void;
  setChannelUsers: (nicks: string[], channelName: string) => void;
  removeChannel: (channelName: string) => void;
  setActiveChannel: (channelName: string) => void;
  getChannel: (channelName: string) => Channel | null;
  addMessageToChannel: (message: ChannelMessage, channelName: string) => void;
  setChannelTopic: (topic: string, channelName: string) => void;
  removeUserFromChannel: (nick: string, channelName: string) => void;
};

export const IrcChannelContext = createContext<IrcChannelContextType | undefined>(undefined);
