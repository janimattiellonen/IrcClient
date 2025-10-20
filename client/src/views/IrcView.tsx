import './IrcView.css';
import { Input } from '../components/Input.tsx';
import type { MessageResponse } from '../contexts/SocketContextDefinition.ts';


type IrcViewProps = {
  handleInput: (message: string) => void;
  messages: MessageResponse[];
}
export function IrcView({ handleInput, messages }: IrcViewProps) {
  return (
    <div className={'irc-view'}>
      <div className={'irc-view-channel-bar'}>CHANNEL BAR</div>

      <div className={'irc-view-content'}>
        <div className={'irc-view-output'}>
          OUTPUT
          {messages.map((message,i) => (
            <p key={i}>{message.data}</p>
          ))}
        </div>

        <div className={'irc-view-input'}>
          <Input handleInput={handleInput} />
        </div>
      </div>

    </div>
  )
}