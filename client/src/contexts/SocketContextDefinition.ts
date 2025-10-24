import { createContext } from 'react';
import type { Socket } from 'socket.io-client';
import type { AppMessage } from '../../../shared/messageTypes';

export type MessageResponse = {
  original: AppMessage;
  response: AppMessage;
  timestamp: string;
};

export type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: AppMessage) => void;
  responses: MessageResponse[];
};

export const SocketContext = createContext<SocketContextType | undefined>(undefined);
