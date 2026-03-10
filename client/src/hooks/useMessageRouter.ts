import { useCallback, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import {
  type ServerEvent,
  SERVER_MESSAGE_CHANNEL_USER_JOIN,
  SERVER_MESSAGE_CHANNEL_USER_MESSAGE,
  SERVER_MESSAGE_ERROR,
  SERVER_MESSAGE_GENERIC_MESSAGE,
} from '../../../shared/protocol';
import { useIrcChannelContext } from './useIrcChannelContext';

type MessageRouterCallbacks = {
  onGenericMessage: (event: ServerEvent) => void;
  onError: (code: string | undefined, message: string) => void;
};

/**
 * Hook that handles routing incoming ServerEvents to the appropriate state handlers.
 * Uses refs to avoid stale closure issues in socket event listeners.
 */
export function useMessageRouter(callbacks: MessageRouterCallbacks) {
  const { addChannel, addUserToChannel, getChannel, addMessageToChannel } = useIrcChannelContext();

  // Use refs to avoid stale closures in the socket event listener
  const addChannelRef = useRef(addChannel);
  const addUserToChannelRef = useRef(addUserToChannel);
  const getChannelRef = useRef(getChannel);
  const addMessageToChannelRef = useRef(addMessageToChannel);
  const callbacksRef = useRef(callbacks);

  addChannelRef.current = addChannel;
  addUserToChannelRef.current = addUserToChannel;
  getChannelRef.current = getChannel;
  addMessageToChannelRef.current = addMessageToChannel;
  callbacksRef.current = callbacks;

  const handleServerEvent = useCallback((data: ServerEvent) => {
    switch (data.type) {
      case SERVER_MESSAGE_GENERIC_MESSAGE: {
        callbacksRef.current.onGenericMessage(data);
        break;
      }

      case SERVER_MESSAGE_CHANNEL_USER_JOIN: {
        const channel = getChannelRef.current(data.payload.channel);

        if (!channel) {
          addChannelRef.current({
            name: data.payload.channel,
            messages: [],
            users: [],
          });
        }

        addUserToChannelRef.current(data.payload.user, data.payload.channel);
        break;
      }

      case SERVER_MESSAGE_CHANNEL_USER_MESSAGE: {
        addMessageToChannelRef.current({
          id: crypto.randomUUID(),
          timestamp: new Date(),
          channelName: data.payload.channel,
          source: data.payload.user.nick,
          message: data.payload.message,
        }, data.payload.channel);
        break;
      }

      case SERVER_MESSAGE_ERROR: {
        callbacksRef.current.onError(data.payload.code, data.payload.message);
        break;
      }
    }
  }, []);

  const attachToSocket = useCallback((socket: Socket) => {
    socket.on('message_response', handleServerEvent);

    return () => {
      socket.off('message_response', handleServerEvent);
    };
  }, [handleServerEvent]);

  return { attachToSocket };
}
