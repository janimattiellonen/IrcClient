import { useState, type ReactNode } from 'react';
import { IrcSessionContext, type IrcSessionContextType } from './IrcSessionContextDefinition';

type IrcSessionProviderProps = {
  children: ReactNode;
}

export function IrcSessionProvider({ children }: IrcSessionProviderProps) {
  const [nickname, setNickname] = useState<string>('');
  const [server, setServer] = useState<string>('');

  const value: IrcSessionContextType = {
    nickname,
    server,
    setNickname,
    setServer,
  };

  return (
    <IrcSessionContext.Provider value={value}>
      {children}
    </IrcSessionContext.Provider>
  );
}