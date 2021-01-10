import React, { createContext, useMemo } from 'react';
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
