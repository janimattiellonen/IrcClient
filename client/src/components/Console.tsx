import './Console.css';
import { useState } from 'react';


type ConsoleProps = {
  handleInput: (message: string) => void;
  messages: string[];
}
export function Console({ handleInput, messages }: ConsoleProps) {
  const [value, setValue] = useState<string>('');

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      console.log('Enter pressed, value:', value);
      if (value.length > 0) {
        handleInput(value)
      }

    }
  }

  return (
    <div className="console-main">
      <div className={'console-output'}>
        {messages.map((message,i) => (
          <p key={i}>{message}</p>
        ))}
      </div>
      <div className={'console-input'}>
        <input value={value}
         onChange={(e) => setValue(e.target.value)}
         onKeyDown={handleKeyDown} type={'text'}></input>
        </div>
    </div>
  );
}