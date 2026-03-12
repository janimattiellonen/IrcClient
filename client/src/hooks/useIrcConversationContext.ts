import { useContext } from 'react';
import { IrcConversationContext } from '../contexts/IrcConversationContextDefinitions.ts';

export const useIrcConversationContext = () => {
  const context = useContext(IrcConversationContext);
  if (context === undefined) {
    throw new Error('useIrcConversationContext must be used within a IrcConversationProvider');
  }
  return context;
};
