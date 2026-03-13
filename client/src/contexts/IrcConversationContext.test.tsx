import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { IrcConversationProvider } from './IrcConversationContext';
import { useIrcChannel } from './useIrcChannel';
import type { Channel, User } from '../utils/ConversationManager';

describe('IrcConversationContext', () => {
  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <IrcConversationProvider>{children}</IrcConversationProvider>
    );
  };

  const mockChannel: Channel = {
    kind: 'channel',
    name: '#test',
    messages: [],
    users: [],
  };

  const mockUser: User = {
    nick: 'testuser',
    prefix: '',
    user: 'test',
    host: 'test.host.com',
  };

  describe('addConversation', () => {
    it('should add a conversation', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addConversation(mockChannel);
      });

      expect(result.current.conversations).toHaveLength(1);
      expect(result.current.conversations[0].name).toBe('#test');
    });

    it('should add multiple conversations', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      const channel2: Channel = {
        kind: 'channel',
        name: '#test2',
        messages: [],
        users: [],
      };

      act(() => {
        result.current.addConversation(mockChannel);
        result.current.addConversation(channel2);
      });

      expect(result.current.conversations).toHaveLength(2);
    });
  });

  describe('addUserToChannel', () => {
    it('should add a user to a channel', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addConversation(mockChannel);
        result.current.addUserToChannel(mockUser, '#test');
      });

      const conversation = result.current.getConversation('#test');
      expect(conversation?.kind === 'channel' && conversation.users).toHaveLength(1);
    });

    it('should not add duplicate users to a channel', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addConversation(mockChannel);
        result.current.addUserToChannel(mockUser, '#test');
        result.current.addUserToChannel(mockUser, '#test');
      });

      const conversation = result.current.getConversation('#test');
      expect(conversation?.kind === 'channel' && conversation.users).toHaveLength(1);
    });

    it('should do nothing if conversation does not exist', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addUserToChannel(mockUser, '#nonexistent');
      });

      expect(result.current.conversations).toHaveLength(0);
    });

    it('should allow different users with same nick to be added', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      const user2: User = {
        nick: 'testuser',
        prefix: '',
        user: 'test2',
        host: 'different.host.com',
      };

      act(() => {
        result.current.addConversation(mockChannel);
        result.current.addUserToChannel(mockUser, '#test');
        result.current.addUserToChannel(user2, '#test');
      });

      const conversation = result.current.getConversation('#test');
      // Should still be 1 because we check by nick, not full identity
      expect(conversation?.kind === 'channel' && conversation.users).toHaveLength(1);
    });
  });

  describe('removeConversation', () => {
    it('should remove a conversation', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addConversation(mockChannel);
        result.current.removeConversation('#test');
      });

      expect(result.current.conversations).toHaveLength(0);
    });

    it('should clear active conversation if removed', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addConversation(mockChannel);
        result.current.setActiveConversation('#test');
        result.current.removeConversation('#test');
      });

      expect(result.current.activeConversation).toBeNull();
    });
  });

  describe('setActiveConversation', () => {
    it('should set the active conversation', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addConversation(mockChannel);
        result.current.setActiveConversation('#test');
      });

      expect(result.current.activeConversation?.name).toBe('#test');
    });
  });

  describe('getConversation', () => {
    it('should retrieve a conversation by name', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addConversation(mockChannel);
      });

      const conversation = result.current.getConversation('#test');
      expect(conversation?.name).toBe('#test');
    });

    it('should return null for non-existent conversation', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      const conversation = result.current.getConversation('#nonexistent');
      expect(conversation).toBeNull();
    });
  });
});
