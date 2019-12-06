import * as React from 'react';
import { Component, FunctionComponent } from 'react';
import Container from '../Container';
import { ContainerProps } from '../Container/Container';
import useFormPropsProvider from '../../hooks/useFormProps/useFormPropsProvider';

namespace Form {
  export interface Props extends ContainerProps {
    form?: any[];
    formTypes?: FormType[];
    parseValue?: any;
    FormGroup?: Component | FunctionComponent;
    Label?: Component | FunctionComponent;
    Description?: Component | FunctionComponent;
  }
}

function Form({
  form,
  formTypes,
  parseValue,
  FormGroup,
  Label,
  Description,
  ...restProps
}: Form.Props) {
  const Provider = useFormPropsProvider({
    form,
    formTypes,
    parseValue,
    FormGroup,
    Label,
    Description,
  });
  return (
    <Provider>
      <Container {...restProps} />
    </Provider>
  );
}

export default Form;
