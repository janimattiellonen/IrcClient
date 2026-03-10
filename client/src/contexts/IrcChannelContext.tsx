import type { ReactNode } from 'react';
import { useMemo, useState, useCallback } from 'react';
import { IrcChannelContext, type IrcChannelContextType } from './IrcChannelContextDefinitions.ts';
import { ChannelManager, type Channel, type ChannelMessage, type User } from '../utils/ChannelManager.ts';

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
      setChannels([...channelManager.getChannels()]);
    },
    [channelManager]
  );

  const addUserToChannel = useCallback(
    (user: User, channelName: string) => {
      const channel = channelManager.getChannel(channelName);

      if (channel) {
        // Check if user already exists in channel
        const userExists = channel.users.some(
          (existingUser) => existingUser.nick === user.nick
        );

        if (!userExists) {
          channel.users.push(user);
          setChannels([...channelManager.getChannels()]);

          const active = channelManager.getActiveChannel();
          if (active && active.name === channelName) {
            setActiveChannelState({ ...active });
          }
        }
      }
    },
    [channelManager]
  );

  const addMessageToChannel = useCallback(
    (message: ChannelMessage, channelName: string) => {
      const channel = channelManager.getChannel(channelName);

      if (channel) {
        channel.messages.push(message);
        setChannels([...channelManager.getChannels()]);

        // Keep activeChannel state in sync if message is for the active channel
        const active = channelManager.getActiveChannel();
        if (active && active.name === channelName) {
          setActiveChannelState({ ...active });
        }
      }
    },
    [channelManager]
  );

  // Wrapper method: Remove channel
  const removeChannel = useCallback(
    (channelName: string) => {
      channelManager.removeChannel(channelName);
      setChannels(channelManager.getChannels());

      // Update active channel state to match what ChannelManager has
      setActiveChannelState(channelManager.getActiveChannel());
    },
    [channelManager]
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
    addUserToChannel,
    removeChannel,
    setActiveChannel,
    getChannel,
    addMessageToChannel
  };

  return <IrcChannelContext.Provider value={value}>{children}</IrcChannelContext.Provider>;
}
