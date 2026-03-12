import { useContext } from 'react';
import { IrcConversationContext } from './IrcConversationContextDefinitions';

export function useIrcChannel() {
  const context = useContext(IrcConversationContext);

  if (!context) {
    throw new Error('useIrcChannel must be used within an IrcConversationProvider');
  }

  return context;
}
