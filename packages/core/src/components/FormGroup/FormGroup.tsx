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
  isRequired,
  BaseFormComponent,
  BaseFormGroup,
  BaseLabel,
  BaseDescription,
  BaseErrorMessage,
  formatLabel,
  formatErrorMessage,
  formatEnum,
  preParser,
  parseValue,
  dataPath,
  errors,
  showError,
  __ui,
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
      // event && event.constructor.name === 'SyntheticEvent'
      // if (name) {
      //   console.log({
      //     name,
      //     event: event,
      //     nativeEvent: event && event.nativeEvent,
      //     target: event && event.target,
      //   });
      // }
      const received =
        event && typeof event.target === 'object' ? event.target.value : event;
      const parsed = preParser(received);
      // console.log([received, parsed]);
      setValue((prevValue: any) => parseValue(parsed, prevValue, schema));
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
  formProps.current = useMemo(() => {
    let props = {
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
      error: { message: '', params: {}, ...get(errors, [0], {}) },
      isRequired,
      isPrimitiveType: primitives.indexOf(schema.type) !== -1,
      isDirty: formState.isDirty,
      isFocused: formState.isFocused,
      isTouched: formState.isTouched,
      __ui: __ui || {},
    };
    if (Array.isArray(schema.enum)) {
      props = {
        ...props,
        schema: {
          ...schema,
          options: {
            ...schema?.options,
            alias:
              schema?.options?.alias ||
              schema.enum.reduce(
                (accum: any, value: string) => ({
                  ...accum,
                  [value]: formatEnum(value, props),
                }),
                {},
              ),
          },
        },
      };
    }
    return {
      ...props,
      formattedLabel: formatLabel(props.label, props),
      error: {
        ...props.error,
        formattedMessage:
          props.error.message && formatErrorMessage(props.error, props),
      },
    };
  }, [
    _defaultValue,
    handleChange,
    name,
    dataPath,
    schema,
    value,
    size,
    errors,
    isRequired,
    formState.isDirty,
    formState.isFocused,
    formState.isTouched,
    formatLabel,
    formatErrorMessage,
    formatEnum,
    __ui,
  ]);

  const Label = useCallback(
    (injectProps: any) =>
      formProps.current.__ui.label ? (
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
            formProps.current.__ui.grid === 'initial' && classNames.flexInitial,
          )}
          {...formProps.current}
          {...injectProps}
        />
      ) : null,
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

  const { isPrimitiveType, isDirty, isFocused, isTouched } = formProps.current;

  // true | false | 'always' | 'dirty' | 'touched' | 'dirty+touched';
  const _showError = useRef<any>();
  _showError.current = useMemo(() => {
    switch (showError) {
      case 'dirty':
        return isDirty;
      case 'touched':
        return isTouched;
      case 'dirty+touched':
        return isDirty && isTouched;
      case true:
      case 'always':
        return true;
      default:
        return false;
    }
  }, [showError, isDirty, isTouched]);

  const ErrorMessage = useCallback(
    (injectProps: any) =>
      _showError.current &&
      formProps.current.errors &&
      formProps.current.errors.length > 0 ? (
        <BaseErrorMessage
          className={classNames.errorMessage}
          {...formProps.current}
          {...injectProps}
        />
      ) : null,
    [BaseErrorMessage, _showError.current, formProps.current.errors],
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
    preParser,
    parseValue,
    size,
    showError,
    formatLabel,
    formatErrorMessage,
    formatEnum,
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
      formatLabel={formatLabel}
      formatErrorMessage={formatErrorMessage}
      formatEnum={formatEnum}
      preParser={preParser}
      parseValue={parseValue}
      size={size}
      showError={showError}
    />
  );
}

export default FormGroupOuter;
