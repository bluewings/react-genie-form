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
import cx from 'classnames';
import { useHandle, useErrors } from '../../hooks';
import useIngredients from './useIngredients';
import classNames from './FormGroup.module.scss';

const primitives = ['string', 'number', 'boolean'];

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
    isFocused: false,
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
      isPrimitiveType: primitives.indexOf(schema.type) !== -1,
      isDirty: formState.isDirty,
      isFocused: formState.isFocused,
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
      formState.isFocused,
      formState.isTouched,
    ],
  );

  const Label = useCallback(
    (injectProps: any) => (
      <BaseLabel
        className={cx(
          classNames.label,
          formProps.current.isPrimitiveType &&
            formProps.current.isDirty &&
            classNames.isDirty,
          formProps.current.isPrimitiveType &&
            formProps.current.isFocused &&
            classNames.isFocused,
          formProps.current.isPrimitiveType &&
            formProps.current.isTouched &&
            classNames.isTouched,
        )}
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
          className={cx(
            classNames.control,
            formProps.current.isPrimitiveType &&
              formProps.current.isDirty &&
              classNames.isDirty,
            formProps.current.isPrimitiveType &&
              formProps.current.isFocused &&
              classNames.isFocused,
            formProps.current.isPrimitiveType &&
              formProps.current.isTouched &&
              classNames.isTouched,
          )}
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

  const timerBlur = useRef<any>();

  const handleFocus = useHandle(() => {
    if (timerBlur.current) {
      clearTimeout(timerBlur.current);
      timerBlur.current = null;
    } else if (formState.isFocused !== true) {
      setFormState((state) => ({ ...state, isFocused: true }));
    }
  });

  const handleBlur = useHandle(() => {
    timerBlur.current = setTimeout(() => {
      timerBlur.current = null;
      if (formState.isFocused !== false) {
        setFormState((state) => ({
          ...state,
          isFocused: false,
          isTouched: true,
        }));
      }
    });
  });

  useEffect(
    () => () => {
      if (timerBlur.current) {
        clearTimeout(timerBlur.current);
        timerBlur.current = null;
      }
    },
    [],
  );

  const { isPrimitiveType, isDirty, isFocused, isTouched } = formProps.current;

  return isRoot ? (
    <FormComponent />
  ) : (
    <BaseFormGroup
      {...formProps.current}
      className={cx(
        classNames.root,
        isPrimitiveType && isDirty && classNames.isDirty,
        isPrimitiveType && isFocused && classNames.isFocused,
        isPrimitiveType && isTouched && classNames.isTouched,
      )}
      classNames={classNames}
      Label={Label}
      FormComponent={FormComponent}
      Description={Description}
      ErrorMessage={ErrorMessage}
      onFocus={handleFocus}
      onBlur={handleBlur}
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
