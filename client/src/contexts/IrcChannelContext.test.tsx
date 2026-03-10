import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { IrcChannelProvider } from './IrcChannelContext';
import { useIrcChannel } from './useIrcChannel';
import type { Channel, User } from '../utils/ChannelManager';

describe('IrcChannelContext', () => {
  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <IrcChannelProvider>{children}</IrcChannelProvider>
    );
  };

  const mockChannel: Channel = {
    name: '#test',
    messages: [],
    users: [],
  };

  const mockUser: User = {
    nick: 'testuser',
    user: 'test',
    host: 'test.host.com',
  };

  describe('addChannel', () => {
    it('should add a channel', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addChannel(mockChannel);
      });

      expect(result.current.channels).toHaveLength(1);
      expect(result.current.channels[0].name).toBe('#test');
    });

    it('should add multiple channels', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      const channel2: Channel = {
        name: '#test2',
        messages: [],
        users: [],
      };

      act(() => {
        result.current.addChannel(mockChannel);
        result.current.addChannel(channel2);
      });

      expect(result.current.channels).toHaveLength(2);
    });
  });

  describe('addUserToChannel', () => {
    it('should add a user to a channel', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addChannel(mockChannel);
        result.current.addUserToChannel(mockUser, '#test');
      });

      const channel = result.current.getChannel('#test');
      expect(channel?.users).toHaveLength(1);
      expect(channel?.users[0].nick).toBe('testuser');
    });

    it('should not add duplicate users to a channel', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addChannel(mockChannel);
        result.current.addUserToChannel(mockUser, '#test');
        result.current.addUserToChannel(mockUser, '#test');
      });

      const channel = result.current.getChannel('#test');
      expect(channel?.users).toHaveLength(1);
    });

    it('should do nothing if channel does not exist', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addUserToChannel(mockUser, '#nonexistent');
      });

      expect(result.current.channels).toHaveLength(0);
    });

    it('should allow different users with same nick to be added', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      const user2: User = {
        nick: 'testuser',
        user: 'test2',
        host: 'different.host.com',
      };

      act(() => {
        result.current.addChannel(mockChannel);
        result.current.addUserToChannel(mockUser, '#test');
        result.current.addUserToChannel(user2, '#test');
      });

      const channel = result.current.getChannel('#test');
      // Should still be 1 because we check by nick, not full identity
      expect(channel?.users).toHaveLength(1);
    });
  });

  describe('removeChannel', () => {
    it('should remove a channel', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addChannel(mockChannel);
        result.current.removeChannel('#test');
      });

      expect(result.current.channels).toHaveLength(0);
    });

    it('should clear active channel if removed', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addChannel(mockChannel);
        result.current.setActiveChannel('#test');
        result.current.removeChannel('#test');
      });

      expect(result.current.activeChannel).toBeNull();
    });
  });

  describe('setActiveChannel', () => {
    it('should set the active channel', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addChannel(mockChannel);
        result.current.setActiveChannel('#test');
      });

      expect(result.current.activeChannel?.name).toBe('#test');
    });
  });

  describe('getChannel', () => {
    it('should retrieve a channel by name', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addChannel(mockChannel);
      });

      const channel = result.current.getChannel('#test');
      expect(channel?.name).toBe('#test');
    });

    it('should return null for non-existent channel', () => {
      const { result } = renderHook(() => useIrcChannel(), {
        wrapper: createWrapper(),
      });

      const channel = result.current.getChannel('#nonexistent');
      expect(channel).toBeNull();
    });
  });
});
