import React, { createContext, useMemo } from 'react';
import baseFormTypes from '../formTypes';
import ErrorBoundary from '../components/ErrorBoundary';
import { useFormTypes } from '../hooks';

const FormTypesContext = createContext<any>({});

const Provider = ({ formTypes, formTypeMap, children }: any) => {
  const mergedFormTypes = useMemo(
    () =>
      [
        ...Object.entries(formTypeMap || {}).map(([path, Component]: any) => ({
          test: (hint: any) => hint.path === path,
          component: (props: any) => {
            return (
              <ErrorBoundary>
                <Component {...props} />
              </ErrorBoundary>
            )
          },
        })),
        ...(formTypes || []),
        ...baseFormTypes,
      ].filter(Boolean),
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
