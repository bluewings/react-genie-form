import { useMemo } from 'react';
import { get } from 'lodash-es';
import Context from './Context';
import defaultFormTypes from '../../formTypes';
import defaultParseValue from '../../parseValue';

function useContextProvider(params: any) {
  const formProps = useFormProps(params);

  const errors = useErrors(params);

  const value = useMemo(() => ({ formProps, errors }), [formProps, errors]);

  return [Context.Provider, value] as any[];
}

export default useContextProvider;

function useErrors({ errors }: any): any {
  const serialized = useMemo(() => JSON.stringify(errors), [errors]);

  const errorsByDataPath = useMemo(
    () =>
      (errors || []).reduce(
        (accum: any, e: any) => ({
          ...accum,
          [e.dataPath]: [...(accum[e.dataPath] || []), e],
        }),
        {},
      ),
    [serialized],
  );

  return useMemo(() => ({ errors, dataPath: errorsByDataPath }), [
    errors,
    errorsByDataPath,
  ]);
}

function useFormProps({
  form,
  formTypes,
  parseValue,
  plugin,
  FormGroup,
  Label,
  Description,
  ErrorMessage,
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
      ErrorMessage: ErrorMessage || get(plugin, ['ErrorMessage']),
    }),
    [
      plugin,
      mergedForm,
      mergedFormTypes,
      mergedParseValue,
      FormGroup,
      Label,
      Description,
      ErrorMessage,
    ],
  );

  return formProps;
}
