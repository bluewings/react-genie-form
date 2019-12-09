import { get } from 'lodash-es';
import useContext from './useContext';
import { useMemo } from 'react';

function useErrors(dataPath: string) {
  const value = useContext('errors');
  return useMemo(() => get(value, ['dataPath', dataPath]), [value, dataPath]);
}

export default useErrors;
