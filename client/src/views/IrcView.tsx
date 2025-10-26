import './IrcView.css';
import { Input } from '../components/Input.tsx';
//import type { MessageResponse } from '../contexts/SocketContextDefinition.ts';
import { ChannelBar } from '../components/channels/ChannelBar.tsx';
import type { AppMessage } from 'shared/messageTypes.ts';

type IrcViewProps = {
  handleInput: (message: string) => void;
  messages: AppMessage[];
};


function renderMessage(message : AppMessage) {
  console.log(`renderMessage: ${JSON.stringify(message, null,2 )}`);
  if (message.type === 'SERVER_MESSAGE_GENERIC_MESSAGE') {
    return <span>{message.payload.message}</span>
  }

  return '';
}

export function IrcView({ handleInput, messages }: IrcViewProps) {
  console.log(`MESSAGES: ${JSON.stringify(messages,null,2)}`);
  return (
    <div className={'irc-view'}>
      <div className={'irc-view-channel-bar'}>
        <ChannelBar />
      </div>

      <div className={'irc-view-content'}>
        <div className={'irc-view-output'}>
          OUTPUT
          {messages.map((message, i) => (
            <p key={i}>{renderMessage(message)}</p>
          ))}
        </div>

        <div className={'irc-view-input'}>
          <Input handleInput={handleInput} />
        </div>
      </div>
    </div>
  );
}
