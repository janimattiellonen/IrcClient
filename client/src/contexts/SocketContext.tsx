import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { AppMessage } from '../../../shared/messageTypes';
import {
  SocketContext,
  type MessageResponse,
  type SocketContextType,
} from './SocketContextDefinition';
import { useIrcChannelContext } from '../hooks/useIrcChannelContext.ts';

type SocketProviderProps = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [responses, setResponses] = useState<MessageResponse[]>([]);
  const { addChannel } = useIrcChannelContext();

  useEffect(() => {
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: false,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      addChannel({
        name: 'Console',
        messages: [],
      });
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketInstance.on('message_response', (data: MessageResponse) => {
      console.log('Received response:', data);

      data.response.type
      // data.response:
      /*
      {
        raw: ':Guest67!~u@epmw7nfq4pm9w.irc JOIN #foo3'
        type: 'CHANNEL_NEW_USER',
        user: {
          nick: 'Guest67',
          user: '~u',
          host: 'epmw7nfq4pm9w.irc',
        }
        channel: '#foo3',
      }
      {
        raw: ':ergo.test 353 jme4 = #foo3 :@jme4',
        type: 'CHANNEL_USER_LIST',
        channel: '#foo3',
        users: {
          '@jme4',
          // tai
          {
            nick: 'jme4'
            'isChannelOperator': true
          }
        }
      }
      */

      // TODO: Pseudo code
      /*
      if (data.response.type === 'USER_JOINS_CHANNEL') {

      }
*/

      setResponses((prev) => [...prev, data]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, [addChannel]);

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
    (message: AppMessage) => {
      if (socket && isConnected) {
        socket.emit('send_message', { message });
      }
    },
    [socket, isConnected]
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
