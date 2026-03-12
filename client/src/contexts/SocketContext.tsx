import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { ClientMessage } from '../../../shared/protocol';
import type { ServerEvent } from '../../../shared/protocol';
import {
  SocketContext,
  type SocketContextType,
  type TimestampedEvent,
} from './SocketContextDefinition';
import { useIrcChannelContext } from '../hooks/useIrcChannelContext.ts';
import { useIrcSessionContext } from '../hooks/useIrcSessionContext.ts';
import { useMessageRouter } from '../hooks/useMessageRouter.ts';

type SocketProviderProps = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [responses, setResponses] = useState<TimestampedEvent[]>([]);
  const { addChannel } = useIrcChannelContext();
  const { nickname } = useIrcSessionContext();
  const nicknameRef = { current: nickname };
  nicknameRef.current = nickname;

  const { attachToSocket } = useMessageRouter({
    onGenericMessage: (event: ServerEvent) => {
      setResponses((prev) => [...prev, { event, timestamp: new Date() }]);
    },
    onError: (code, message) => {
      console.error(`IRC error${code ? ` (${code})` : ''}: ${message}`);
    },
    getNickname: () => nicknameRef.current,
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
