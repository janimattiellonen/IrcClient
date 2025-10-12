import { createContext, useContext, useState, type ReactNode } from 'react';


type IrcSessionContextType = {
  nickname: string;
  server: string;
  setNickname: (nickname: string) => void;
  setServer: (nickname: string) => void;
}

const IrcSessionContext = createContext<IrcSessionContextType | undefined>(undefined);

type OIrcSessionProviderProps = {
  children: ReactNode;
}

export function IrcSessionProvide({ children }: OIrcSessionProviderProps) {
  const [nickname, setNickname] = useState<string>('');
  const [server, setServer] = useState<string >('');

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

export const useIrcSessionContext = () => {
  const context = useContext(IrcSessionContext);
  if (context === undefined) {
    throw new Error('useIrcSessionContext must be used within a IrcSessionProvider');
  }
  return context;
};