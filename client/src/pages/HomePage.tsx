
import {Console} from '../components/Console.tsx';
import { handleInput } from '../utils/input-handler.ts';
import { useSocketContext } from '../hooks/useSocketContext.ts';

export const HomePage = () => {
  const { sendMessage, responses } = useSocketContext();

  function onInput (message: string): void {
    console.log(`foo, message: ${message}`);

    handleInput(message, sendMessage);
  }

  return (
    <div>
      <h1>IRC Client</h1>
      <Console handleInput={onInput} messages={responses}/>
    </div>
  );
};
