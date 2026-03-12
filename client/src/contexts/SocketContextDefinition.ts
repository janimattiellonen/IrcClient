import { createContext } from 'react';
import type { Socket } from 'socket.io-client';
import type { ClientMessage } from '../../../shared/protocol';
import type { ServerEvent } from '../../../shared/protocol';

export type TimestampedEvent = {
  event: ServerEvent;
  timestamp: Date;
};

export type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: ClientMessage) => void;
  responses: TimestampedEvent[];
};

export const SocketContext = createContext<SocketContextType | undefined>(undefined);
