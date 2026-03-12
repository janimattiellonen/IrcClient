import { useCallback, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import {
  type ServerEvent,
  SERVER_MESSAGE_CHANNEL_TOPIC,
  SERVER_MESSAGE_CHANNEL_USER_JOIN,
  SERVER_MESSAGE_CHANNEL_USER_LIST,
  SERVER_MESSAGE_CHANNEL_USER_MESSAGE,
  SERVER_MESSAGE_CHANNEL_USER_PART,
  SERVER_MESSAGE_ERROR,
  SERVER_MESSAGE_GENERIC_MESSAGE,
  SERVER_MESSAGE_PRIVATE_MESSAGE,
} from '../../../shared/protocol';
import { useIrcConversationContext } from './useIrcConversationContext';

type MessageRouterCallbacks = {
  onGenericMessage: (event: ServerEvent) => void;
  onError: (code: string | undefined, message: string) => void;
  getNickname: () => string;
};

/**
 * Hook that handles routing incoming ServerEvents to the appropriate state handlers.
 * Uses refs to avoid stale closure issues in socket event listeners.
 */
export function useMessageRouter(callbacks: MessageRouterCallbacks) {
  const { addConversation, addUserToChannel, setChannelUsers, getConversation, addMessage, setChannelTopic, removeConversation, removeUserFromChannel } = useIrcConversationContext();

  const addConversationRef = useRef(addConversation);
  const addUserToChannelRef = useRef(addUserToChannel);
  const setChannelUsersRef = useRef(setChannelUsers);
  const getConversationRef = useRef(getConversation);
  const addMessageRef = useRef(addMessage);
  const setChannelTopicRef = useRef(setChannelTopic);
  const removeConversationRef = useRef(removeConversation);
  const removeUserFromChannelRef = useRef(removeUserFromChannel);
  const callbacksRef = useRef(callbacks);

  addConversationRef.current = addConversation;
  addUserToChannelRef.current = addUserToChannel;
  setChannelUsersRef.current = setChannelUsers;
  getConversationRef.current = getConversation;
  addMessageRef.current = addMessage;
  setChannelTopicRef.current = setChannelTopic;
  removeConversationRef.current = removeConversation;
  removeUserFromChannelRef.current = removeUserFromChannel;
  callbacksRef.current = callbacks;

  const handleServerEvent = useCallback((data: ServerEvent) => {
    switch (data.type) {
      case SERVER_MESSAGE_GENERIC_MESSAGE: {
        callbacksRef.current.onGenericMessage(data);
        break;
      }

      case SERVER_MESSAGE_CHANNEL_USER_LIST: {
        const conversation = getConversationRef.current(data.payload.channel);

        if (!conversation) {
          addConversationRef.current({
            kind: 'channel',
            name: data.payload.channel,
            messages: [],
            users: [],
          });
        }

        setChannelUsersRef.current(data.payload.nicks, data.payload.channel);
        break;
      }

      case SERVER_MESSAGE_CHANNEL_USER_JOIN: {
        const conversation = getConversationRef.current(data.payload.channel);

        if (!conversation) {
          addConversationRef.current({
            kind: 'channel',
            name: data.payload.channel,
            messages: [],
            users: [],
          });
        }

        addUserToChannelRef.current(data.payload.user, data.payload.channel);
        break;
      }

      case SERVER_MESSAGE_CHANNEL_TOPIC: {
        setChannelTopicRef.current(data.payload.topic, data.payload.channel);

        if (data.payload.changedBy) {
          addMessageRef.current({
            id: crypto.randomUUID(),
            timestamp: new Date(),
            conversationName: data.payload.channel,
            source: '',
            message: `${data.payload.changedBy} changed the topic to: ${data.payload.topic}`,
          }, data.payload.channel);
        }
        break;
      }

      case SERVER_MESSAGE_CHANNEL_USER_MESSAGE: {
        addMessageRef.current({
          id: crypto.randomUUID(),
          timestamp: new Date(),
          conversationName: data.payload.channel,
          source: data.payload.user.nick,
          message: data.payload.message,
        }, data.payload.channel);
        break;
      }

      case SERVER_MESSAGE_CHANNEL_USER_PART: {
        const nick = data.payload.user.nick;
        const channel = data.payload.channel;

        if (nick === callbacksRef.current.getNickname()) {
          removeConversationRef.current(channel);
        } else {
          removeUserFromChannelRef.current(nick, channel);
        }
        break;
      }

      case SERVER_MESSAGE_PRIVATE_MESSAGE: {
        const myNick = callbacksRef.current.getNickname();
        // If we sent it (echo), the conversation name is the recipient; otherwise it's the sender
        const conversationName = data.payload.sender.nick === myNick
          ? data.payload.recipient
          : data.payload.sender.nick;

        const existing = getConversationRef.current(conversationName);

        if (!existing) {
          addConversationRef.current({
            kind: 'private',
            name: conversationName,
            messages: [],
          });
        }

        addMessageRef.current({
          id: crypto.randomUUID(),
          timestamp: new Date(),
          conversationName,
          source: data.payload.sender.nick,
          message: data.payload.message,
        }, conversationName);
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
