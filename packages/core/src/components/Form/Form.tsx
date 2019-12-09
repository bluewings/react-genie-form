import * as React from 'react';
import { Component, FunctionComponent, useState, useRef } from 'react';
import Container from '../Container';
import { ContainerProps } from '../Container/Container';
import useContextProvider from '../../hooks/useContext/useContextProvider';
import { useHandle, useSchema, useValidate } from '../../hooks';

namespace Form {
  export interface Props extends ContainerProps {
    form?: any[];
    formTypes?: FormType[];
    parseValue?: any;
    plugin?: Plugin;
    FormGroup?: Component | FunctionComponent;
    Label?: Component | FunctionComponent;
    Description?: Component | FunctionComponent;
    ErrorMessage?: Component | FunctionComponent;
  }
}

function Form({
  form,
  formTypes,
  parseValue,
  plugin,
  schema,
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

  const [Provider, value] = useContextProvider({
    form,
    formTypes,
    parseValue,
    plugin,
    schema,
    FormGroup,
    Label,
    Description,
    ErrorMessage,
    onChange,
    errors,
  });

  return (
    <Provider value={value}>
      <Container {...restProps} schema={_schema} onChange={handleChange} />
    </Provider>
  );
}

export default Form;
