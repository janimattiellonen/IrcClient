import { createContext } from 'react';

export type IrcSessionContextType = {
  nickname: string;
  server: string;
  port: number;
  setNickname: (nickname: string) => void;
  setServer: (nickname: string) => void;
  setPort: (port: number) => void;
}

export const IrcSessionContext = createContext<IrcSessionContextType | undefined>(undefined);
