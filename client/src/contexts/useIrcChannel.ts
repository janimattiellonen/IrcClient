import { useContext } from 'react';
import { IrcChannelContext } from './IrcChannelContextDefinitions';

export function useIrcChannel() {
  const context = useContext(IrcChannelContext);

  if (!context) {
    throw new Error('useIrcChannel must be used within an IrcChannelProvider');
  }

  return context;
}
