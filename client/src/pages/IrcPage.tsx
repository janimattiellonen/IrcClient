import { handleInput } from '../utils/input-handler.ts';
import { useSocketContext } from '../hooks/useSocketContext.ts';
import { useIrcChannelContext } from '../hooks/useIrcChannelContext.ts';
import { IrcView } from '../views/IrcView.tsx';

export const IrcPage = () => {
  const { sendMessage, responses } = useSocketContext();
  const { activeChannel } = useIrcChannelContext();

  function onInput(message: string): void {
    handleInput(message, sendMessage, activeChannel?.name ?? null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
      <h1
        style={{
          margin: 0,
          padding: '20px',
          backgroundColor: '#333',
          color: 'white',
          flexShrink: 0,
        }}
      >
        IRC Client
      </h1>
      <IrcView handleInput={onInput} messages={responses} />
    </div>
  );
};
