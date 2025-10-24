import type { ReactNode } from 'react';
import { useMemo, useState, useCallback } from 'react';
import { IrcChannelContext, type IrcChannelContextType } from './IrcChannelContextDefinitions.ts';
import { ChannelManager, type Channel } from '../utils/ChannelManager.ts';

type IrcChannelProviderProps = {
  children: ReactNode;
};

export function IrcChannelProvider({ children }: IrcChannelProviderProps) {
  // Create ChannelManager instance only once
  const channelManager = useMemo(() => new ChannelManager(), []);

  // React state to trigger re-renders
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannelState] = useState<Channel | null>(null);

  // Wrapper method: Add channel
  const addChannel = useCallback(
    (channel: Channel) => {
      channelManager.addChannel(channel);
      setChannels(channelManager.getChannels());
    },
    [channelManager]
  );

  // Wrapper method: Remove channel
  const removeChannel = useCallback(
    (channelName: string) => {
      channelManager.removeChannel(channelName);
      setChannels(channelManager.getChannels());

      // If we removed the active channel, clear it
      if (activeChannel?.name === channelName) {
        setActiveChannelState(null);
      }
    },
    [channelManager, activeChannel]
  );

  // Wrapper method: Set active channel
  const setActiveChannel = useCallback(
    (channelName: string) => {
      const channel = channelManager.setActiveChannel(channelName);
      setActiveChannelState(channel);
    },
    [channelManager]
  );

  // Wrapper method: Get channel (doesn't need to update state)
  const getChannel = useCallback(
    (channelName: string) => {
      return channelManager.getChannel(channelName);
    },
    [channelManager]
  );

  const value: IrcChannelContextType = {
    channels,
    activeChannel,
    addChannel,
    removeChannel,
    setActiveChannel,
    getChannel,
  };

  return <IrcChannelContext.Provider value={value}>{children}</IrcChannelContext.Provider>;
}
