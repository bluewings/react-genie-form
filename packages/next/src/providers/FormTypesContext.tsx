import React, { createContext, useMemo } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import baseFormTypes from '../formTypes';
import { useFormTypes } from '../hooks';

const FormTypesContext = createContext<any>({});

const Provider = ({ formTypes, formTypeMap, children }: any) => {
  const mergedFormTypes = useMemo(
    () =>
      [
        ...Object.entries(formTypeMap || {}).map(([path, component]: any) => ({
          test: (hint: any) => hint.path === path,
          component,
        })),
        ...(formTypes || []),
        ...baseFormTypes,
      ].filter(Boolean).filter(e => e.component)
      .map((e: any) => {
        const Component: any = e.component
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
