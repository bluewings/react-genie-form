import * as React from 'react';
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { get } from 'lodash-es';
import { useHandle, useErrors } from '../../hooks';
import useIngredients from './useIngredients';
import classNames from './FormGroup.module.scss';

type FormState = {
  hasBeenFocused: boolean;
  isDirty: boolean;
  isTouched: boolean;
};

function FormGroupInner({
  defaultValue,
  isRoot,
  name,
  onChange,
  schema = {},
  size,
  BaseFormComponent,
  BaseFormGroup,
  BaseLabel,
  BaseDescription,
  BaseErrorMessage,
  parseValue,
  dataPath,
  errors,
}: any) {
  const [_defaultValue, isSchemaDefault] = useMemo(
    () =>
      typeof defaultValue !== 'undefined'
        ? [defaultValue, false]
        : [get(schema, ['default']), true],
    [],
  );
  const batch = useRef<boolean>(isSchemaDefault);
  const [value, setValue] = useState(_defaultValue);

  const [formState, setFormState] = useState({
    isDirty: false,
    isTouched: false,
  });

  const handleChange = useHandle(
    (event: SyntheticEvent | any, _batch?: boolean) => {
      const received =
        event && event.constructor.name === 'SyntheticEvent'
          ? event.target.value
          : event;
      setValue((prevValue: any) => parseValue(received, prevValue, schema));
      if (_batch !== true && formState.isDirty !== true) {
        setFormState((state) => ({ ...state, isDirty: true }));
      }
    },
  );
  useEffect(() => {
    onChange(value, batch.current);
    batch.current = false;
  }, [value]);
  // useEffect(() => {
  //   if (defaultValue !== _defaultValue) {
  //     console.log('_defaultValue', _defaultValue);
  //     handleChange(_defaultValue, true);
  //   }
  // }, []);

  const formProps = useRef<any>();
  formProps.current = useMemo(
    () => ({
      defaultValue: _defaultValue,
      description: schema.description,
      label: schema.title || name,
      name,
      onChange: handleChange,
      dataPath,
      schema,
      value,
      size,
      errors,
      isDirty: formState.isDirty,
      isTouched: formState.isTouched,
    }),
    [
      _defaultValue,
      handleChange,
      name,
      dataPath,
      schema,
      value,
      size,
      errors,
      formState.isDirty,
      formState.isTouched,
    ],
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
    size,
  } = useIngredients(schema);

  const dataPath = useMemo(
    () => (isRoot ? '' : [parentDataPath, name].join('.')),
    [isRoot, parentDataPath, name],
  );
  const errors = useErrors(dataPath, schema);
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
      size={size}
    />
  );
}

export default FormGroupOuter;
