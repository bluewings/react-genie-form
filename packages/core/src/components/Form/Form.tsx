import * as React from 'react';
import { Component, FunctionComponent, useState, useMemo, useRef } from 'react';
import { get } from 'lodash-es';
import Container from '../Container';
import { ContainerProps } from '../Container/Container';
import useContextProvider from '../../hooks/useContext/useContextProvider';
import { useHandle, useSchema, useValidate } from '../../hooks';

namespace Form {
  export interface Props extends ContainerProps {
    form?: any[];
    formTypes?: FormType[];
    parseValue?: any;
    plugin?: any;
    customValidate?: StringFunctionMap;
    errors?: any[];
    FormGroup?: Component | FunctionComponent;
    Label?: Component | FunctionComponent;
    Description?: Component | FunctionComponent;
    ErrorMessage?: Component | FunctionComponent;
  }
}

const enums = {
  layout: ['vertical', 'horizontal'],
  labelAlign: ['right', 'center', 'left'],
  size: ['default', 'small', 'large'],
};

const getPreferredValue = (type: string, value: any) => {
  const values = get(enums, [type], []);
  return values.indexOf(value) !== -1 ? value : values[0];
};

function Form({
  form,
  formTypes,
  parseValue,
  plugin,
  schema,
  customValidate,
  layout,
  labelAlign,
  size,
  errors: errorsReceived,
  FormGroup,
  Label,
  Description,
  ErrorMessage,
  onChange,
  ...restProps
}: Form.Props) {
  const _schema = useSchema(schema);
  const validate = useValidate(_schema, customValidate);

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

  const _layout = useMemo(() => getPreferredValue('layout', layout), [layout]);
  const _labelAlign = useMemo(
    () => getPreferredValue('labelAlign', labelAlign),
    [labelAlign],
  );
  const _size = useMemo(() => getPreferredValue('size', size), [size]);

  const [Provider, value] = useContextProvider({
    form,
    formTypes,
    parseValue,
    plugin,
    schema: _schema,
    layout: _layout,
    labelAlign: _labelAlign,
    size: _size,
    FormGroup,
    Label,
    Description,
    ErrorMessage,
    onChange,
    errors,
    errorsReceived,
  });

  return (
    <Provider value={value}>
      <Container
        {...restProps}
        schema={_schema}
        layout={_layout}
        labelAlign={_labelAlign}
        size={_size}
        plugin={plugin}
        onChange={handleChange}
      />
    </Provider>
  );
}

export default Form;
