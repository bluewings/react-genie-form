import { useRef } from 'react';

type ResultBox<T> = { v: T };

function useConstant<T>(fn: () => T | T): T {
  const ref = useRef<ResultBox<T>>();
  if (!ref.current) {
    ref.current = { v: typeof fn === 'function' ? fn() : fn };
  }
  return ref.current.v;
}

export default useConstant;
