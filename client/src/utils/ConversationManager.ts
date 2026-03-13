export type ConversationMessage = {
  id: string;
  timestamp: Date;
  conversationName: string;
  source: string;
  message: string;
};

export type User = {
  nick: string;
  prefix: string;
  user: string;
  host: string;
}

export type Channel = {
  kind: 'channel';
  name: string;
  topic?: string;
  messages: ConversationMessage[];
  users: User[];
};

export type PrivateConversation = {
  kind: 'private';
  name: string;
  messages: ConversationMessage[];
};

export type Conversation = Channel | PrivateConversation;

export function isChannel(conv: Conversation): conv is Channel {
  return conv.kind === 'channel';
}

export function isPrivateConversation(conv: Conversation): conv is PrivateConversation {
  return conv.kind === 'private';
}

type ConversationRegistry = {
  [key: string]: Conversation;
};

export class ConversationManager {
  private conversations: ConversationRegistry;
  private activeConversation: Conversation | null = null;

  constructor() {
    this.conversations = {};
    this.activeConversation = null;
  }

  setActiveConversation(name: string): Conversation {
    if (!this.conversations[name]) {
      throw new Error(`No conversation found with the name ${name}`);
    }

    const conversation = this.conversations[name];
    this.activeConversation = conversation;

    return conversation;
  }

  clearActiveConversation(): void {
    this.activeConversation = null;
  }

  addConversation(conversation: Conversation): void {
    if (this.conversations[conversation.name]) {
      throw new Error(`Conversation ${conversation.name} already exists`);
    }

    this.conversations[conversation.name] = conversation;
  }

  getActiveConversation(): Conversation | null {
    return this.activeConversation;
  }

  getConversation(name: string): Conversation | null {
    return this.conversations[name] || null;
  }

  getConversations(): Conversation[] {
    return Object.values(this.conversations);
  }

  renameUser(oldNick: string, newNick: string): void {
    // Update user lists in all channels
    for (const conversation of Object.values(this.conversations)) {
      if (conversation.kind === 'channel') {
        const user = conversation.users.find((u) => u.nick === oldNick);
        if (user) {
          user.nick = newNick;
        }
      }
    }

    // Rename PM conversation if one exists with the old nick
    const pmConversation = this.conversations[oldNick];
    if (pmConversation && pmConversation.kind === 'private') {
      delete this.conversations[oldNick];
      pmConversation.name = newNick;
      this.conversations[newNick] = pmConversation;
    }
  }

  removeConversation(name: string): void {
    if (!this.conversations[name]) {
      throw new Error(`Conversation ${name} does not exist`);
    }

    delete this.conversations[name];

    const conversations = this.getConversations();

    if (conversations.length > 0) {
      this.setActiveConversation(conversations[0].name);
    } else {
      this.clearActiveConversation();
    }
  }
}
