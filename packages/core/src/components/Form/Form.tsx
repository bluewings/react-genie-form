import React, { useEffect } from 'react';
import {
  Component,
  FunctionComponent,
  forwardRef,
  useState,
  useMemo,
  useImperativeHandle,
  useRef,
} from 'react';
import { get } from 'lodash-es';
import Container from '../Container';
import { ContainerProps } from '../Container/Container';
import useContextProvider from '../../hooks/useContext/useContextProvider';
import { useHandle, useSchema, useValidate } from '../../hooks';
import { hashCode } from '../../helpers/util';

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
    ErrorSummary?: Component | FunctionComponent;
    formatLabel?: Function;
    formatErrorMessage?: Function;
    formatEnum?: Function;
    showError?: Boolean | 'always' | 'dirty' | 'touched' | 'dirty+touched';
    required?: string[];
    onChangeWithErrors?: (value: any, errors: any) => void;
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

const structError = (value: any, errors: any) => ({
  hash: hashCode({ value, errors }),
  value,
  errors,
});

function Form(
  {
    form,
    formTypes,
    parseValue,
    plugin,
    schema,
    customValidate,
    defaultValue,
    layout,
    labelAlign,
    size,
    errors: errorsReceived,
    showError,
    showErrorSummary,
    required,
    FormGroup,
    Label,
    Description,
    ErrorMessage,
    ErrorSummary,
    formatLabel,
    formatErrorMessage,
    formatEnum,
    onChange,
    onChangeWithErrors,
    ...restProps
  }: Form.Props,
  ref: any,
) {
  const _schema = useSchema(schema, required);
  const validate = useValidate(_schema, customValidate, defaultValue);

  const currValue = useRef<any>(defaultValue);
  const [errStruct, setErrors] = useState<any>(structError(defaultValue, []));
  const { errors } = errStruct;

  const handleChangeWithErrors = useHandle(onChangeWithErrors);
  useEffect(() => {
    handleChangeWithErrors(
      errStruct.value,
      errStruct.errors && errStruct.errors.length > 0
        ? errStruct.errors
        : undefined,
    );
  }, [errStruct.hash]);

  const handleChange = useHandle(async (value: any) => {
    currValue.current = value;
    if (typeof onChange === 'function') {
      onChange(value);
    }

    const _errors: any[] = await validate(value);
    if (
      errors !== _errors &&
      JSON.stringify(errors) !== JSON.stringify(_errors)
    ) {
      setErrors(structError(value, _errors));
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
    ErrorSummary,
    formatLabel,
    formatErrorMessage,
    formatEnum,
    onChange,
    errors,
    errorsReceived,
    showError,
  });

  useImperativeHandle(ref, () => ({
    getValue: async () => {
      const value = currValue.current;
      const errors: any[] = await validate(value);
      return { value, errors };
    },
  }));

  return (
    <Provider value={value}>
      <Container
        {...restProps}
        schema={_schema}
        defaultValue={defaultValue}
        layout={_layout}
        labelAlign={_labelAlign}
        size={_size}
        plugin={plugin}
        onChange={handleChange}
        showErrorSummary={showErrorSummary}
      />
    </Provider>
  );
}

export default forwardRef(Form);
