import * as React from 'react';
import { SyntheticEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useHandle, useErrors } from '../../hooks';
import useIngredients from './useIngredients';

import classNames from './FormGroup.module.scss';

function FormGroupInner({
  defaultValue,
  isRoot,
  name,
  onChange,
  schema = {},
  BaseFormComponent,
  BaseFormGroup,
  BaseLabel,
  BaseDescription,
  BaseErrorMessage,
  parseValue,
  dataPath,
  errors,
}: any) {
  const [value, setValue] = useState(defaultValue);
  const handleChange = useHandle((event: SyntheticEvent | any) => {
    const received =
      event && event.constructor.name === 'SyntheticEvent'
        ? event.target.value
        : event;
    const nextValue = parseValue(received, value, schema);
    setValue(nextValue);
    onChange(nextValue);
  });

  const formProps = useRef<any>();
  formProps.current = useMemo(
    () => ({
      defaultValue,
      description: schema.description,
      label: schema.title || name,
      name,
      onChange: handleChange,
      dataPath,
      schema,
      value,
      errors,
    }),
    [defaultValue, handleChange, name, dataPath, schema, value, errors],
  );

  const Label = useCallback(
    (injectProps: any) => (
      <BaseLabel
        className={classNames.label}
        {...formProps.current}
        {...injectProps}
      />
    ),
    [BaseLabel],
  );

  const FormComponent = useCallback(
    (injectProps: any) =>
      BaseFormComponent ? (
        <BaseFormComponent
          className={classNames.control}
          {...formProps.current}
          {...injectProps}
        />
      ) : null,
    [BaseFormComponent],
  );

  const Description = useCallback(
    (injectProps: any) =>
      schema.description ? (
        <BaseDescription
          className={classNames.description}
          {...formProps.current}
          {...injectProps}
        />
      ) : null,
    [BaseDescription],
  );

  const ErrorMessage = useCallback(
    (injectProps: any) =>
      formProps.current.errors && formProps.current.errors.length > 0 ? (
        <BaseErrorMessage
          className={classNames.errorMessage}
          {...formProps.current}
          {...injectProps}
        />
      ) : null,
    [BaseErrorMessage],
  );

  return isRoot ? (
    <FormComponent />
  ) : (
    <BaseFormGroup
      {...formProps.current}
      classNames={classNames}
      Label={Label}
      FormComponent={FormComponent}
      Description={Description}
      ErrorMessage={ErrorMessage}
    />
  );
}

const FC = React.memo(FormGroupInner);

function FormGroupOuter(props: any) {
  const {
    schema,
    isRoot,
    parentDataPath,
    name,
    FormComponent,
    Label,
    Description,
    ErrorMessage,
  } = props;
  const {
    BaseFormComponent,
    BaseFormGroup,
    BaseLabel,
    BaseDescription,
    BaseErrorMessage,
    parseValue,
  } = useIngredients(schema);

  const dataPath = useMemo(
    () => (isRoot ? '' : [parentDataPath, name].join('.')),
    [isRoot, parentDataPath, name],
  );
  const errors = useErrors(dataPath);

  return (
    <FC
      {...props}
      dataPath={dataPath}
      errors={errors}
      BaseFormComponent={FormComponent || BaseFormComponent}
      BaseFormGroup={BaseFormGroup}
      BaseLabel={Label || BaseLabel}
      BaseDescription={Description || BaseDescription}
      BaseErrorMessage={ErrorMessage || BaseErrorMessage}
      parseValue={parseValue}
    />
  );
}

export default FormGroupOuter;
