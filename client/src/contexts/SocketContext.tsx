import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { ClientMessage } from '../../../shared/protocol';
import type { ServerEvent } from '../../../shared/protocol';
import {
  SocketContext,
  type SocketContextType,
} from './SocketContextDefinition';
import { useIrcChannelContext } from '../hooks/useIrcChannelContext.ts';
import { useMessageRouter } from '../hooks/useMessageRouter.ts';

type SocketProviderProps = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [responses, setResponses] = useState<ServerEvent[]>([]);
  const { addChannel } = useIrcChannelContext();

  const { attachToSocket } = useMessageRouter({
    onGenericMessage: (event: ServerEvent) => {
      setResponses((prev) => [...prev, event]);
    },
    onError: (code, message) => {
      console.error(`IRC error${code ? ` (${code})` : ''}: ${message}`);
    },
  });

  useEffect(() => {
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: false,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      addChannel({
        name: 'Console',
        messages: [],
        users: [],
      });
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    const detachRouter = attachToSocket(socketInstance);

    setSocket(socketInstance);

    return () => {
      detachRouter();
      socketInstance.close();
    };
  }, [addChannel, attachToSocket]);

  const connect = useCallback(() => {
    if (socket && !isConnected) {
      socket.connect();
    }
  }, [socket, isConnected]);

  const disconnect = useCallback(() => {
    if (socket && isConnected) {
      socket.disconnect();
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback(
    (message: ClientMessage) => {
      if (socket && isConnected) {
        socket.emit('send_message', { message });
      }
    },
    [socket, isConnected],
  );

  const value: SocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect,
    sendMessage,
    responses,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
