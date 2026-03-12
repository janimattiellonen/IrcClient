import './IrcView.css';
import { Input } from '../components/Input.tsx';
import { ChannelBar } from '../components/channels/ChannelBar.tsx';
import { UserBar } from '../components/users/UserBar.tsx';
import { useIrcChannelContext } from '../hooks/useIrcChannelContext.ts';
import type { TimestampedEvent } from '../contexts/SocketContextDefinition.ts';
import type { ChannelMessage } from '../utils/ChannelManager.ts';
import { formatTimestamp } from '../utils/formatTimestamp.ts';

type IrcViewProps = {
  handleInput: (message: string) => void;
  messages: TimestampedEvent[];
};

function renderGenericMessage({ event, timestamp }: TimestampedEvent) {
  if (event.type === 'SERVER_MESSAGE_GENERIC_MESSAGE') {
    return <span>{formatTimestamp(timestamp)} {event.payload.message}</span>;
  }

  return null;
}

function renderChannelMessage(message: ChannelMessage) {
  return (
    <span>
      {formatTimestamp(message.timestamp)} <strong>{message.source}</strong>: {message.message}
    </span>
  );
}

export function IrcView({ handleInput, messages }: IrcViewProps) {
  const { activeChannel } = useIrcChannelContext();

  const isConsole = !activeChannel || activeChannel.name === 'Console';

  return (
    <div className={'irc-view'}>
      <div className={'irc-view-channel-bar'}>
        <ChannelBar />
      </div>

      <div className={'irc-view-content'}>
        {!isConsole && activeChannel.topic && (
          <div className={'irc-view-topic'}>{activeChannel.topic}</div>
        )}

        <div className={'irc-view-main'}>
          <div className={'irc-view-output'}>
            {isConsole
              ? messages.map((message, i) => (
                  <p key={i}>{renderGenericMessage(message)}</p>
                ))
              : activeChannel.messages.map((message) => (
                  <p key={message.id}>{renderChannelMessage(message)}</p>
                ))}
          </div>

          {!isConsole && <UserBar users={activeChannel.users} />}
        </div>

        <div className={'irc-view-input'}>
          <Input handleInput={handleInput} />
        </div>
      </div>
    </div>
  );
}
