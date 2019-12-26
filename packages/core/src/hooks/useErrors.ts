import { get } from 'lodash-es';
import useContext from './useContext';
import { useMemo } from 'react';

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
        ],
        [],
      )
      .filter((e) => e);
    return errors.length > 0 ? errors : undefined;
  }, [value, dataPaths]);
}

export default useErrors;
