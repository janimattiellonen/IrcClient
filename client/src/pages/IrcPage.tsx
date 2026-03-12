import { handleInput } from '../utils/input-handler.ts';
import { useSocketContext } from '../hooks/useSocketContext.ts';
import { useIrcConversationContext } from '../hooks/useIrcConversationContext.ts';
import { IrcView } from '../views/IrcView.tsx';

export const IrcPage = () => {
  const { sendMessage, responses } = useSocketContext();
  const { activeConversation } = useIrcConversationContext();

  function onInput(message: string): void {
    handleInput(
      message,
      sendMessage,
      activeConversation?.name ?? null,
      activeConversation?.kind ?? null
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
      <h1
        style={{
          margin: 0,
          padding: '12px 20px',
          backgroundColor: 'var(--bg-dark)',
          color: 'var(--text-bright)',
          fontSize: '1.4em',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        IRC Client
      </h1>
      <IrcView handleInput={onInput} messages={responses} />
    </div>
  );
};
