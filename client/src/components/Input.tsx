import { useState } from 'react';


type InputProps = {
  handleInput: (value: string) => void;
}
export function Input({handleInput}: InputProps) {
  const [value, setValue] = useState<string>('');

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      console.log('Enter pressed, value:', value);
      if (value.length > 0) {
        handleInput(value);
        setValue('');
      }
    }
  }

  return (
      <input value={value}
             onChange={(e) => setValue(e.target.value)}
             onKeyDown={handleKeyDown} type={'text'}></input>
  )
}