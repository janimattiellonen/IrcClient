import * as ContextMenu from '@radix-ui/react-context-menu';
import './UserContextMenu.css';
import type { User } from '../../utils/ConversationManager.ts';

export type UserAction = 'private_message' | 'kick' | 'give_op' | 'remove_op';

type UserContextMenuProps = {
  user: User;
  onAction: (action: UserAction, user: User) => void;
  children: React.ReactNode;
};

export function UserContextMenu({ user, onAction, children }: UserContextMenuProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="user-context-menu-content">
          <ContextMenu.Label className="user-context-menu-label">
            {user.nick}
          </ContextMenu.Label>
          <ContextMenu.Separator className="user-context-menu-separator" />
          <ContextMenu.Item
            className="user-context-menu-item"
            onSelect={() => onAction('private_message', user)}
          >
            Private Message
          </ContextMenu.Item>
          <ContextMenu.Separator className="user-context-menu-separator" />
          <ContextMenu.Item
            className="user-context-menu-item"
            onSelect={() => onAction('give_op', user)}
          >
            Give Op
          </ContextMenu.Item>
          <ContextMenu.Item
            className="user-context-menu-item"
            onSelect={() => onAction('remove_op', user)}
          >
            Remove Op
          </ContextMenu.Item>
          <ContextMenu.Separator className="user-context-menu-separator" />
          <ContextMenu.Item
            className="user-context-menu-item user-context-menu-item--danger"
            onSelect={() => onAction('kick', user)}
          >
            Kick
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
