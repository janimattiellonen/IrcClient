import { createContext } from 'react';
import type { Channel } from '../utils/ChannelManager.ts';

export type IrcChannelContextType = {
  channels: Channel[];
  activeChannel: Channel | null;
  addChannel: (channel: Channel) => void;
  removeChannel: (channelName: string) => void;
  setActiveChannel: (channelName: string) => void;
  getChannel: (channelName: string) => Channel | null;
};

export const IrcChannelContext = createContext<IrcChannelContextType | undefined>(undefined);
