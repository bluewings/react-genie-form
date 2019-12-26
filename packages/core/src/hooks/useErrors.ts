import { get } from 'lodash-es';
import useContext from './useContext';
import { useMemo } from 'react';

const messageFirst = (a: any, b: any) => {
  const c = a.message ? 1 : 0;
  const d = b.message ? 1 : 0;
  return c === d ? 0 : c > d ? -1 : 1;
};

function useErrors(dataPath: string, schema: any) {
  const value = useContext('errors');
  const dataPaths = useMemo(
    () => [dataPath, ...get(schema, ['__dataPaths'], [])].filter((e) => e),
    [dataPath, schema],
  );
  return useMemo(() => {
    const errors = dataPaths
      .reduce(
        (accum: any[], dataPath: any) => [
          ...accum,
          ...get(value, ['dataPath', dataPath], []),
          ...get(value, ['receivedDataPath', dataPath], []),
        ],
        [],
      )
      .filter((e) => e)
      .sort(messageFirst);
    return errors.length > 0 ? errors : undefined;
  }, [value, dataPaths]);
}

export default useErrors;
