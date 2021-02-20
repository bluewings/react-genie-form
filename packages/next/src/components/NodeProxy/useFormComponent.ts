import React, { useMemo } from 'react';
import { Schema } from '../../nodes';

function useFormComponent(node: any, _formTypes: any[]) {
  const formTypes = useFormProps(_formTypes);

  const hint = useMemo(() => getHint(node), [node]);

  const BaseFormComponent = useMemo(() => {
    const Found = formTypes.reduce(
      (found: any, { component, test }: any) =>
        found === null && typeof test === 'function' && test(hint)
          ? component
          : found,
      null,
    );

    return Found ? React.memo(Found) : null;
  }, [hint, formTypes]);

  return BaseFormComponent;
}

export default useFormComponent;

interface Hint {
  type: string;
  schema: any;
  format: string;
  formType: string;
  [key: string]: any;
}

const getHint = ({ getPath, schema }: any): Hint => ({
  path: getPath(),
  type: schema?.type,
  schema,
  format: schema?.options?.format || schema?.format,
  formType: schema?.options?.formType || schema?.formType,
});

const useFormProps = (formTypes: any[]) => {
  const mergedFormTypes = useMemo(
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
  return mergedFormTypes;
};
