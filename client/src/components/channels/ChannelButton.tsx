import './ChannelButton.css';

type ChannelButtonProps = {
  isActive: boolean;
  name: string;
  onClick: (name: string) => void;
};

export function ChannelButton({ isActive, name, onClick }: ChannelButtonProps) {
  return (
    <button
      role={'button'}
      className={`channel ${isActive ? 'active' : ''}`}
      onClick={() => onClick(name)}
    >
      <div className="name">{name}</div>
    </button>
  );
}
