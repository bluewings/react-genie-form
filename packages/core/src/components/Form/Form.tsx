import * as React from 'react';
import { Component, FunctionComponent, useState, useMemo, useRef } from 'react';
import Container from '../Container';
import { ContainerProps } from '../Container/Container';
import useContextProvider from '../../hooks/useContext/useContextProvider';
import { useHandle, useSchema, useValidate } from '../../hooks';

namespace Form {
  export interface Props extends ContainerProps {
    form?: any[];
    formTypes?: FormType[];
    parseValue?: any;
    size?: 'small' | 'default' | 'large';
    FormGroup?: Component | FunctionComponent;
    Label?: Component | FunctionComponent;
    Description?: Component | FunctionComponent;
    ErrorMessage?: Component | FunctionComponent;
  }
}

const enums = {
  sizes: ['default', 'small', 'large'],
};

function Form({
  form,
  formTypes,
  parseValue,
  plugin,
  schema,
  size,
  FormGroup,
  Label,
  Description,
  ErrorMessage,
  onChange,
  ...restProps
}: Form.Props) {
  const _schema = useSchema(schema);
  const validate = useValidate(_schema);

  const [errors, setErrors] = useState<any[]>([]);
  const handleChange = useHandle(async (value: any) => {
    if (typeof onChange === 'function') {
      onChange(value);
    }

    const _errors: any[] = await validate(value);
    if (
      errors !== _errors &&
      JSON.stringify(errors) !== JSON.stringify(_errors)
    ) {
      setErrors(_errors);
    }
  });

  const _size = useMemo(
    () => (enums.sizes.indexOf(size || '') !== -1 ? size : enums.sizes[0]),
    [size],
  );

  const [Provider, value] = useContextProvider({
    form,
    formTypes,
    parseValue,
    plugin,
    schema: _schema,
    size: _size,
    FormGroup,
    Label,
    Description,
    ErrorMessage,
    onChange,
    errors,
  });

  return (
    <Provider value={value}>
      <Container
        {...restProps}
        schema={_schema}
        plugin={plugin}
        onChange={handleChange}
      />
    </Provider>
  );
}

export default Form;
