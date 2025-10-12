import { createContext } from 'react';

export type IrcSessionContextType = {
  nickname: string;
  server: string;
  setNickname: (nickname: string) => void;
  setServer: (nickname: string) => void;
}

export const IrcSessionContext = createContext<IrcSessionContextType | undefined>(undefined);
