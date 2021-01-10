import { useMemo } from 'react';

export interface Hint {
  type: string;
  schema: any;
  format: string;
  formType: string;
  [key: string]: any;
}

const useFormProps = (formTypes: any[]) => {
  const transformed = useMemo(
    () =>
      formTypes
        .map(({ component, test }) => {
          let testFn;
          if (typeof test === 'function') {
            testFn = test;
          } else if (typeof test === 'object') {
            testFn = (hint: Hint) =>
              Object.keys(test).reduce(
                (prev, key) =>
                  prev &&
                  ((Array.isArray(test[key]) &&
                    test[key].indexOf(hint[key]) === -1) ||
                    (!Array.isArray(test[key]) && test[key] !== hint[key]))
                    ? false
                    : prev,
                true,
              );
          }
          return { component, test: testFn };
        })
        .filter(({ test }) => test),
    [formTypes],
  );
  return transformed;
};

export default useFormProps;
