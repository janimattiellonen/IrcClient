import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { AppMessage } from '../../../shared/messageTypes';
import { SocketContext, type MessageResponse, type SocketContextType } from './SocketContextDefinition';

type SocketProviderProps = {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [responses, setResponses] = useState<MessageResponse[]>([]);

  useEffect(() => {
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: false,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketInstance.on('message_response', (data: MessageResponse) => {
      console.log('Received response:', data);
      setResponses((prev) => [...prev, data]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

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

  const sendMessage = useCallback((message: AppMessage) => {
    if (socket && isConnected) {
      socket.emit('send_message', { message });
    }
  }, [socket, isConnected]);

  const value: SocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect,
    sendMessage,
    responses,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
