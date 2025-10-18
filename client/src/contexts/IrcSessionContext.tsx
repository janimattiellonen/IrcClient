import { useState, type ReactNode } from 'react';
import { IrcSessionContext, type IrcSessionContextType } from './IrcSessionContextDefinition';

type IrcSessionProviderProps = {
  children: ReactNode;
}

export function IrcSessionProvider({ children }: IrcSessionProviderProps) {
  const [nickname, setNickname] = useState<string>('');
  const [server, setServer] = useState<string>('');
  const [port, setPort] = useState<number>(0);

  const value: IrcSessionContextType = {
    nickname,
    server,
    setNickname,
    setServer,
    port,
    setPort
  };

  return (
    <IrcSessionContext.Provider value={value}>
      {children}
    </IrcSessionContext.Provider>
  );
}