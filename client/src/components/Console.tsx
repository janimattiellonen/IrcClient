import './Console.css';
import type { MessageResponse } from '../contexts/SocketContextDefinition.ts';
import { Input } from './Input.tsx';

type ConsoleProps = {
  handleInput: (message: string) => void;
  messages: MessageResponse[];
};
export function Console({ handleInput, messages }: ConsoleProps) {
  console.log(`Console, messages: ${JSON.stringify(messages, null, 2)}`);

  return (
    <div className="console-main">
      <div className={'console-output'}>
        {messages.map((message, i) => (
          <p key={i}>{message.data}</p>
        ))}
      </div>
      <div className={'console-input'}>
        <Input handleInput={handleInput} />
      </div>
    </div>
  );
}
