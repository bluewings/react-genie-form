import { useMemo, isValidElement } from 'react';
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

function useErrors({ errors, errorsReceived: received }: any): any {
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

  const serializedReceived = useMemo(() => JSON.stringify(received), [
    received,
  ]);

  const receivedDataPath = useMemo(
    () =>
      (received || []).reduce(
        (accum: any, e: any) => ({
          ...accum,
          [e.dataPath]: [...(accum[e.dataPath] || []), e],
        }),
        {},
      ),
    [serializedReceived],
  );

  return useMemo(
    () => ({
      errors,
      dataPath: errorsByDataPath,
      received,
      receivedDataPath,
    }),
    [errors, errorsByDataPath, received, receivedDataPath],
  );
}

function useFormProps({
  schema,
  form,
  formTypes,
  parseValue,
  plugin,
  size,
  FormGroup,
  Label,
  Description,
  ErrorMessage,
  ErrorSummary,
  showError,
}: any) {
  const mergedForm = useMemo(() => {
    const virtual = Object.entries(
      get(schema, ['options', 'virtual'], {}),
    ).reduce(
      (accum: any, [name, v]: any) => ({
        ...accum,
        [v.fields[0]]: { type: '__virtual', ...v, name },
        [name]: { type: '__virtual', ...v, name },
      }),
      {},
    );
    let virtualFields: string[] = [];
    let merged = (form || ['*'])
      .map((name: any) =>
        typeof name === 'string'
          ? { name }
          : typeof name === 'object' && isValidElement(name)
          ? { name: '__reactElement', reactElement: name }
          : name,
      )
      .map((e: any) => {
        let next = e;
        if (virtual[e.name] && Array.isArray(virtual[e.name].fields)) {
          next = { type: '__virtual', ...virtual[e.name] };
        }
        if (next.type === '__virtual' && Array.isArray(next.fields)) {
          virtualFields = [...virtualFields, ...next.fields];
        }
        return next;
      })
      .filter(
        (e: any, i: number, arr: any[]) =>
          e &&
          typeof e.name === 'string' &&
          virtualFields.indexOf(e.name) === -1 &&
          (arr.findIndex(({ name }: any) => e.name === name) === i ||
            e.name.match(/^__/)),
      );
    const names = merged.map((e: any) => e.name);
    const rest = Object.keys(schema.properties || {}).filter(
      (e) => names.indexOf(e) === -1 && virtualFields.indexOf(e) === -1,
    );
    const dict = Object.entries(schema.properties || {}).reduce(
      (accum: any, [name, subSchema]: any) => ({
        ...accum,
        [name]: Object.entries(subSchema).reduce(
          (prev: any, [k, v]: any) =>
            k.match(/^ui:.*$/) ? { ...prev, [k.replace(/^ui:/, '')]: v } : prev,
          {},
        ),
      }),
      {},
    );
    return merged
      .reduce(
        (accum: any, e: any) =>
          e.name === '*'
            ? [...accum, ...rest.map((name: string) => ({ ...e, name }))]
            : [...accum, e],
        [],
      )
      .map((e: any) => ({ ...(dict[e.name] || {}), ...e }));
  }, [schema, form]);

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
      size,
      FormGroup: FormGroup || get(plugin, ['FormGroup']),
      Label: Label || get(plugin, ['Label']),
      Description: Description || get(plugin, ['Description']),
      ErrorMessage: ErrorMessage || get(plugin, ['ErrorMessage']),
      ErrorSummary: ErrorSummary || get(plugin, ['ErrorSummary']),
      showError: showError || false,
    }),
    [
      plugin,
      mergedForm,
      mergedFormTypes,
      mergedParseValue,
      size,
      FormGroup,
      Label,
      Description,
      ErrorMessage,
      ErrorSummary,
      showError,
    ],
  );

  return formProps;
}
