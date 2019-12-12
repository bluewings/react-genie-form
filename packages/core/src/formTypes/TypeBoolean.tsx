import * as React from 'react';
import { FormEvent, useEffect, useRef } from 'react';
import { useHandle } from '../hooks';

function TypeBoolean({ name, defaultValue, onChange, schema }: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useHandle((event: FormEvent<EventTarget>) => {
    const target = event.target as HTMLInputElement;
    onChange(!!target.checked);
  });

  useEffect(() => {
    if (inputRef.current) {
      if (
        inputRef.current.indeterminate !== true &&
        defaultValue === undefined
      ) {
        inputRef.current.indeterminate = true;
      } else if (!!inputRef.current.checked !== !!defaultValue) {
        inputRef.current.checked = !!defaultValue;
      }
    }
  }, [defaultValue]);

  return (
    <input ref={inputRef} type="checkbox" name={name} onClick={handleClick} />
  );
}

export default TypeBoolean;
