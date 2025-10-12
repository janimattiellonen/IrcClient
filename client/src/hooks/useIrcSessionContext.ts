import { useContext } from 'react';
import { IrcSessionContext } from '../contexts/IrcSessionContextDefinition';

export const useIrcSessionContext = () => {
  const context = useContext(IrcSessionContext);
  if (context === undefined) {
    throw new Error('useIrcSessionContext must be used within a IrcSessionProvider');
  }
  return context;
};
