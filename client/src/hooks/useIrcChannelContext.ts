import { useContext } from 'react';
import { IrcChannelContext } from '../contexts/IrcChannelContextDefinitions.ts';

export const useIrcChannelContext = () => {
  const context = useContext(IrcChannelContext);
  if (context === undefined) {
    throw new Error('useIrcChannelContext must be used within a IrcChannelProvider');
  }
  return context;
};
