import type { ReactNode } from 'react';
import { useMemo, useState, useCallback } from 'react';
import { IrcConversationContext, type IrcConversationContextType } from './IrcConversationContextDefinitions.ts';
import { ConversationManager, isChannel, type Conversation, type ConversationMessage, type User } from '../utils/ConversationManager.ts';

type IrcConversationProviderProps = {
  children: ReactNode;
};

export function IrcConversationProvider({ children }: IrcConversationProviderProps) {
  const conversationManager = useMemo(() => new ConversationManager(), []);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);
  const [conversationsWithUnread, setConversationsWithUnread] = useState<Set<string>>(new Set());

  const addConversation = useCallback(
    (conversation: Conversation) => {
      conversationManager.addConversation(conversation);
      setConversations([...conversationManager.getConversations()]);
    },
    [conversationManager]
  );

  const addUserToChannel = useCallback(
    (user: User, channelName: string) => {
      const conversation = conversationManager.getConversation(channelName);

      if (conversation && isChannel(conversation)) {
        const userExists = conversation.users.some(
          (existingUser) => existingUser.nick === user.nick
        );

        if (!userExists) {
          conversation.users.push(user);
          setConversations([...conversationManager.getConversations()]);

          const active = conversationManager.getActiveConversation();
          if (active && active.name === channelName) {
            setActiveConversationState({ ...active });
          }
        }
      }
    },
    [conversationManager]
  );

  const setChannelUsers = useCallback(
    (nicks: { nick: string; prefix: string }[], channelName: string) => {
      const conversation = conversationManager.getConversation(channelName);

      if (conversation && isChannel(conversation)) {
        conversation.users = nicks.map(({ nick, prefix }) => ({ nick, prefix, user: '', host: '' }));
        setConversations([...conversationManager.getConversations()]);

        const active = conversationManager.getActiveConversation();
        if (active && active.name === channelName) {
          setActiveConversationState({ ...active });
        }
      }
    },
    [conversationManager]
  );

  const addMessage = useCallback(
    (message: ConversationMessage, conversationName: string) => {
      const conversation = conversationManager.getConversation(conversationName);

      if (conversation) {
        conversation.messages.push(message);
        setConversations([...conversationManager.getConversations()]);

        const active = conversationManager.getActiveConversation();
        if (active && active.name === conversationName) {
          setActiveConversationState({ ...active });
        } else {
          setConversationsWithUnread((prev) => new Set(prev).add(conversationName));
        }
      }
    },
    [conversationManager]
  );

  const setChannelTopic = useCallback(
    (topic: string, channelName: string) => {
      const conversation = conversationManager.getConversation(channelName);

      if (conversation && isChannel(conversation)) {
        conversation.topic = topic;
        setConversations([...conversationManager.getConversations()]);

        const active = conversationManager.getActiveConversation();
        if (active && active.name === channelName) {
          setActiveConversationState({ ...active });
        }
      }
    },
    [conversationManager]
  );

  const removeUserFromChannel = useCallback(
    (nick: string, channelName: string) => {
      const conversation = conversationManager.getConversation(channelName);

      if (conversation && isChannel(conversation)) {
        conversation.users = conversation.users.filter((u) => u.nick !== nick);
        setConversations([...conversationManager.getConversations()]);

        const active = conversationManager.getActiveConversation();
        if (active && active.name === channelName) {
          setActiveConversationState({ ...active });
        }
      }
    },
    [conversationManager]
  );

  const renameUser = useCallback(
    (oldNick: string, newNick: string) => {
      conversationManager.renameUser(oldNick, newNick);
      setConversations([...conversationManager.getConversations()]);

      const active = conversationManager.getActiveConversation();
      if (active) {
        setActiveConversationState({ ...active });
      }
    },
    [conversationManager]
  );

  const removeConversation = useCallback(
    (name: string) => {
      conversationManager.removeConversation(name);
      setConversations(conversationManager.getConversations());
      setActiveConversationState(conversationManager.getActiveConversation());
    },
    [conversationManager]
  );

  const setActiveConversation = useCallback(
    (name: string) => {
      const conversation = conversationManager.setActiveConversation(name);
      setActiveConversationState(conversation);
      setConversationsWithUnread((prev) => {
        if (!prev.has(name)) return prev;
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    },
    [conversationManager]
  );

  const getConversation = useCallback(
    (name: string) => {
      return conversationManager.getConversation(name);
    },
    [conversationManager]
  );

  const value: IrcConversationContextType = {
    conversations,
    activeConversation,
    conversationsWithUnread,
    addConversation,
    addUserToChannel,
    setChannelUsers,
    removeConversation,
    setActiveConversation,
    getConversation,
    addMessage,
    setChannelTopic,
    removeUserFromChannel,
    renameUser,
  };

  return <IrcConversationContext.Provider value={value}>{children}</IrcConversationContext.Provider>;
}
