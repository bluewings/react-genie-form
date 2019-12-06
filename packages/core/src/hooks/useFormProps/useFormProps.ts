import { useContext } from 'react';
import Context from './context';

function useFormProps() {
  const value = useContext(Context);
  return value;
}

export default useFormProps;
