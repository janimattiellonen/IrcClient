import './ConversationButton.css';

type ConversationButtonProps = {
  isActive: boolean;
  hasUnread: boolean;
  isClosable: boolean;
  name: string;
  onClick: (name: string) => void;
  onClose: (name: string) => void;
};

export function ConversationButton({ isActive, hasUnread, isClosable, name, onClick, onClose }: ConversationButtonProps) {
  const classNames = ['conversation', isActive ? 'active' : '', hasUnread ? 'unread' : '']
    .filter(Boolean)
    .join(' ');

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(name);
  };

  return (
    <button
      role={'button'}
      className={classNames}
      onClick={() => onClick(name)}
    >
      <div className="name">{name}</div>
      <div className="conversation-indicators">
        {hasUnread && <span className="unread-indicator" />}
        {isClosable && <span className="conversation-close" onClick={handleClose}>&times;</span>}
      </div>
    </button>
  );
}
