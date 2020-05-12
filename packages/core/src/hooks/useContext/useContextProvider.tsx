import React, { useMemo, useRef, useLayoutEffect, isValidElement } from 'react';
import ReactDOM from 'react-dom';
import { get } from 'lodash-es';
import Context from './Context';
import defaultFormTypes from '../../formTypes';
import defaultParseValue from '../../parseValue';

function useContextProvider(params: any) {
  const formProps = useFormProps(params);

  const errors = useErrors(params);

  const { flattened } = params;

  const value = useMemo(() => ({ formProps, errors, flattened }), [
    formProps,
    errors,
    flattened,
  ]);

  return [Context.Provider, value] as any[];
}

const getPortalEntry = (domNode: Element) => ({ children }: any) =>
  ReactDOM.createPortal(children, domNode);

function PortalExit({ domNode }: any) {
  const ref = useRef<any>();
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.appendChild(domNode);
    }
  }, []);
  return <div ref={ref} />;
}

export default useContextProvider;

const addMessageKey = (errors: any) =>
  (errors || []).map((e: any) => ({
    __message: (e.message || '')
      .replace(/\s+/g, '_')
      .toLowerCase()
      .replace(/"[^"]+"/g, '_STR_')
      .replace(/'[^']+'/g, '_STR_')
      .replace(/[0-9]+/g, '_N_')
      .replace(/_{1,}/g, '_')
      .replace(/(^_|_$)/, ''),
    ...e,
  }));

function useErrors({ errors: _errors, errorsReceived: _received }: any): any {
  const serialized = useMemo(() => JSON.stringify(_errors), [_errors]);
  const errors = useMemo(() => addMessageKey(_errors), [serialized]);

  const serializedReceived = useMemo(() => JSON.stringify(_received), [
    _received,
  ]);
  const received = useMemo(() => addMessageKey(_received), [
    serializedReceived,
  ]);

  const errorsByDataPath = useMemo(
    () =>
      errors.reduce((accum: any, e: any) => {
        let next = {
          ...accum,
          [e.dataPath]: [...(accum[e.dataPath] || []), e],
        };
        if (e.keyword === 'required' && e.params && e.params.missingProperty) {
          const dataPath = `${e.dataPath}.${e.params.missingProperty}`;
          next = {
            ...accum,
            [dataPath]: [...(accum[dataPath] || []), { ...e, dataPath }],
          };
        }
        return next;
      }, {}),
    [errors],
  );

  const receivedDataPath = useMemo(
    () =>
      (received || []).reduce((accum: any, e: any) => {
        let next = {
          ...accum,
          [e.dataPath]: [...(accum[e.dataPath] || []), e],
        };
        if (e.keyword === 'required' && e.params && e.params.missingProperty) {
          const dataPath = `${e.dataPath}.${e.params.missingProperty}`;
          next = {
            ...accum,
            [dataPath]: [...(accum[dataPath] || []), { ...e, dataPath }],
          };
        }
        return next;
      }, {}),
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
  formatLabel,
  formatErrorMessage,
  formatEnum,
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
      .map((name: any) => (typeof name === 'string' ? { name } : name))
      .map((e: any) => {
        if (typeof e === 'function') {
          return { name: '__renderFunc', renderFunc: e };
        } else if (isValidElement(e)) {
          return { name: '__reactElement', reactElement: e };
        } else if (e.portal || e['ui:portal']) {
          const domNode = document.createElement('div');
          return {
            name: '__reactElement',
            reactElement: <PortalExit domNode={domNode}>hello</PortalExit>,
            portal: `$.${(e.portal || e['ui:portal'])
              .replace(/^\$/, '')
              .replace(/^\./, '')}`,
            domNode,
          };
        }
        return Object.entries(e).reduce(
          (accum: any, [k, v]) => ({
            ...accum,
            // form 정의시 일부 예약된 항목은 키값을 변환하지 않는다.
            [['name', 'type', 'fields', 'formType', 'FormComponent'].indexOf(
              k,
            ) !== -1
              ? k
              : `ui:${k.replace(/^ui:/, '')}`]: v,
          }),
          {},
        );
      })
      .map((e: any) => {
        let next = e;
        if (virtual[e.name] && Array.isArray(virtual[e.name].fields)) {
          next = {
            type: '__virtual',
            ...e,
            name: undefined,
            ...virtual[e.name],
          };
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

  const portal = useMemo(
    () =>
      mergedForm.reduce((accum: any, { name, portal, domNode }: any) => {
        if (
          name === '__reactElement' &&
          typeof portal === 'string' &&
          domNode
        ) {
          return { ...accum, [portal]: getPortalEntry(domNode) };
        }
        return accum;
      }, {}),
    [mergedForm],
  );

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
      formatLabel: formatLabel || get(plugin, ['formatLabel']),
      formatErrorMessage:
        formatErrorMessage || get(plugin, ['formatErrorMessage']),
      formatEnum: formatEnum || get(plugin, ['formatEnum']),
      showError: showError || false,
      portal,
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
      formatLabel,
      formatErrorMessage,
      formatEnum,
      showError,
      portal,
    ],
  );

  return formProps;
}
