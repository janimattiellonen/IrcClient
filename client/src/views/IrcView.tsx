import './IrcView.css';
import { Input } from '../components/Input.tsx';
import { ChannelBar } from '../components/channels/ChannelBar.tsx';
import { useIrcChannelContext } from '../hooks/useIrcChannelContext.ts';
import type { ServerEvent } from '../../../shared/protocol';
import type { ChannelMessage } from '../utils/ChannelManager.ts';

type IrcViewProps = {
  handleInput: (message: string) => void;
  messages: ServerEvent[];
};

function renderGenericMessage(message: ServerEvent) {
  if (message.type === 'SERVER_MESSAGE_GENERIC_MESSAGE') {
    return <span>{message.payload.message}</span>;
  }

  return null;
}

function renderChannelMessage(message: ChannelMessage) {
  return (
    <span>
      <strong>{message.source}</strong>: {message.message}
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
        <div className={'irc-view-output'}>
          {isConsole
            ? messages.map((message, i) => (
                <p key={i}>{renderGenericMessage(message)}</p>
              ))
            : activeChannel.messages.map((message) => (
                <p key={message.id}>{renderChannelMessage(message)}</p>
              ))}
        </div>

        <div className={'irc-view-input'}>
          <Input handleInput={handleInput} />
        </div>
      </div>
    </div>
  );
}
