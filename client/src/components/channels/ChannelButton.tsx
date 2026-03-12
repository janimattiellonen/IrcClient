import './ChannelButton.css';

type ChannelButtonProps = {
  isActive: boolean;
  hasUnread: boolean;
  isPartable: boolean;
  name: string;
  onClick: (name: string) => void;
  onPart: (name: string) => void;
};

export function ChannelButton({ isActive, hasUnread, isPartable, name, onClick, onPart }: ChannelButtonProps) {
  const classNames = ['channel', isActive ? 'active' : '', hasUnread ? 'unread' : '']
    .filter(Boolean)
    .join(' ');

  const handlePart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPart(name);
  };

  return (
    <button
      role={'button'}
      className={classNames}
      onClick={() => onClick(name)}
    >
      <div className="name">{name}</div>
      <div className="channel-indicators">
        {hasUnread && <span className="unread-indicator" />}
        {isPartable && <span className="channel-close" onClick={handlePart}>&times;</span>}
      </div>
    </button>
  );
}
