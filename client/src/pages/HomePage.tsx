
import {Console} from '../components/Console.tsx';
import { handleInput } from '../utils/input-handler.ts';

export const HomePage = () => {

  function onInput (message: string): void {
    console.log(`foo, message: ${message}`);

    handleInput(message);
  }

  return (
    <div>
      <h1>IRC Client</h1>
      <Console handleInput={onInput} messages={['sdpfjdofigjiodf hgdo', 'dsofihdfiughdfi']}/>
    </div>
  );
};
