import './UserBar.css';
import type { User } from '../../utils/ConversationManager.ts';
import { UserContextMenu, type UserAction } from './UserContextMenu.tsx';

type UserBarProps = {
  users: User[];
  onUserAction: (action: UserAction, user: User) => void;
};

export function UserBar({ users, onUserAction }: UserBarProps) {
  return (
    <div className={'user-bar'}>
      <div className={'user-bar-title'}>Users</div>
      {users.map((user) => (
        <UserContextMenu key={user.nick} user={user} onAction={onUserAction}>
          <div className={'user-bar-nick'}>
            {user.nick}
          </div>
        </UserContextMenu>
      ))}
    </div>
  );
}
