import { createContext } from 'react';
import type { Conversation, ConversationMessage, User } from '../utils/ConversationManager.ts';

export type IrcConversationContextType = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  conversationsWithUnread: Set<string>;
  addConversation: (conversation: Conversation) => void;
  addUserToChannel: (user: User, channelName: string) => void;
  setChannelUsers: (nicks: { nick: string; prefix: string }[], channelName: string) => void;
  removeConversation: (name: string) => void;
  setActiveConversation: (name: string) => void;
  getConversation: (name: string) => Conversation | null;
  addMessage: (message: ConversationMessage, conversationName: string) => void;
  setChannelTopic: (topic: string, channelName: string) => void;
  removeUserFromChannel: (nick: string, channelName: string) => void;
  renameUser: (oldNick: string, newNick: string) => void;
};

export const IrcConversationContext = createContext<IrcConversationContextType | undefined>(undefined);
