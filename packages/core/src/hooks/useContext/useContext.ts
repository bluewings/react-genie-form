import { useContext } from 'react';
import Context from './Context';

function useSubContext(namespace: string) {
  const value: any = useContext(Context);
  return value && value[namespace];
}

export default useSubContext;
