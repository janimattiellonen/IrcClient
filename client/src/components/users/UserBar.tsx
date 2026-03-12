import './UserBar.css';
import type { User } from '../../utils/ChannelManager.ts';

type UserBarProps = {
  users: User[];
};

export function UserBar({ users }: UserBarProps) {
  return (
    <div className={'user-bar'}>
      <div className={'user-bar-title'}>Users</div>
      {users.map((user) => (
        <div key={user.nick} className={'user-bar-nick'}>
          {user.nick}
        </div>
      ))}
    </div>
  );
}
