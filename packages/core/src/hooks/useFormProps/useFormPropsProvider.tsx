import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import Context from './context';
import defaultFormTypes from '../../formTypes';
import defaultParseValue from '../../parseValue';

function useFormPropsProvider({
  form,
  formTypes,
  parseValue,
  plugin,
  FormGroup,
  Label,
  Description,
}: any) {
  const mergedForm = useMemo(() => form || [], [form]);

  const mergedFormTypes = useMemo(
    () =>
      [
        ...(formTypes || []),
        ...get(plugin, ['formTypes'], []),
        ...defaultFormTypes,
      ]
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
    [plugin, formTypes],
  );

  const mergedParseValue = useMemo(
    () => ({
      ...(parseValue || {}),
      ...get(formTypes, ['parseValue'], {}),
      ...defaultParseValue,
    }),
    [plugin, parseValue],
  );

  const formProps = useMemo(
    () => ({
      form: mergedForm,
      formTypes: mergedFormTypes,
      parseValue: mergedParseValue,
      FormGroup: FormGroup || get(plugin, ['FormGroup']),
      Label: Label || get(plugin, ['Label']),
      Description: Description || get(plugin, ['Description']),
    }),
    [
      plugin,
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
