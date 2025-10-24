import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface MessageResponse {
  original: string;
  response: string;
  timestamp: string;
}

// TODO: Delete if not needed?
export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [responses, setResponses] = useState<MessageResponse[]>([]);

  useEffect(() => {
    const socketInstance = io('http://localhost:3000', {
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

  const sendMessage = (message: string) => {
    if (socket && isConnected) {
      socket.emit('send_message', { message });
    }
  };

  return { socket, isConnected, connect, disconnect, sendMessage, responses };
};
