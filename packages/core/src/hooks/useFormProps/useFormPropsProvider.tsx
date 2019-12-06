import * as React from 'react';
import { useMemo } from 'react';
import Context from './context';
import defaultFormTypes from '../../formTypes';
import defaultParseValue from '../../parseValue';

function useFormPropsProvider({
  form,
  formTypes,
  FormGroup,
  Label,
  Description,
  parseValue,
}: any) {
  const mergedForm = useMemo(() => form || [], [form]);

  const mergedFormTypes = useMemo(
    () =>
      [...(formTypes || []), ...defaultFormTypes]
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

  const mergedParseValue = useMemo(
    () => ({ ...(parseValue || {}), ...defaultParseValue }),
    [parseValue],
  );

  const formProps = useMemo(
    () => ({
      form: mergedForm,
      formTypes: mergedFormTypes,
      parseValue: mergedParseValue,
      FormGroup,
      Label,
      Description,
    }),
    [
      mergedForm,
      mergedFormTypes,
      mergedParseValue,
      FormGroup,
      Label,
      Description,
    ],
  );

  const Provider = useMemo(
    () => ({ children }: any) => (
      <Context.Provider value={formProps}>{children}</Context.Provider>
    ),
    [formProps],
  );

  return Provider;
}

export default useFormPropsProvider;
