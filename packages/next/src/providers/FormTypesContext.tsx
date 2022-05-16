import React, { createContext, useMemo } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import baseFormTypes from '../formTypes';
import { useFormTypes } from '../hooks';

const FormTypesContext = createContext<any>({});

const Provider = ({ formTypes, formTypeMap, children }: any) => {
  const mergedFormTypes = useMemo(
    () =>
      [
        ...Object.entries(formTypeMap || {}).map(([path, component]: any) => {
          let test = (hint: any) => hint.path === path;
          if (path.match(/\.#(\.|$)/)) {
            const chunk = (path as string).split('.');
            test = (hint: any) => {
              const parts = ((hint.path || '') as string).split('.');
              if (parts.length === chunk.length) {
                return parts.reduce((prev: boolean, curr, i) => {
                  if (prev) {
                    if (chunk[i] === '#' && curr.match(/^[0-9]+$/)) {
                      return true;
                    } 
                    return chunk[i] === curr;
                  }
                  return prev;
                }, true);
              }
              return false;
            }
          }
          return {
            test,
            component,
          };
        }),
        ...(formTypes || []),
        ...baseFormTypes,
      ]
        .filter(Boolean).filter(e => e.component)
        .map((e: any) => {
          const Component: any = e.component;
          return {
            ...e,
            component: (props: any) => {
              return (
                <ErrorBoundary>
                  <Component {...props} />
                </ErrorBoundary>
              )
            }
          }
        }),
    [formTypes, formTypeMap],
  );

  const value = useFormTypes(mergedFormTypes);

  return (
    <FormTypesContext.Provider value={value}>
      {children}
    </FormTypesContext.Provider>
  );
};

export default FormTypesContext;

export { Provider };
