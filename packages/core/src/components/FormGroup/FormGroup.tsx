import * as React from 'react';
import { SyntheticEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useHandle } from '../../hooks';
import useIngredients from './useIngredients';

import classNames from './FormGroup.module.scss';

function FormGroup({
  defaultValue,
  isRoot,
  name,
  onChange,
  parentPath,
  schema = {},
}: any) {
  const {
    BaseFormComponent,
    BaseFormGroup,
    BaseLabel,
    BaseDescription,
    parseValue,
  } = useIngredients(schema);

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
      path: isRoot ? '$' : [parentPath, name].join('.'),
      schema,
      value,
    }),
    [defaultValue, handleChange, isRoot, name, schema, value],
  );

  const Label = useCallback(
    (injectProps: any) => <BaseLabel {...formProps.current} {...injectProps} />,
    [BaseLabel],
  );

  const FormComponent = useCallback(
    (injectProps: any) =>
      BaseFormComponent ? (
        <BaseFormComponent {...formProps.current} {...injectProps} />
      ) : null,
    [BaseFormComponent],
  );

  const Description = useCallback(
    (injectProps: any) =>
      schema.description ? (
        <BaseDescription {...formProps.current} {...injectProps} />
      ) : null,
    [BaseLabel],
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
    />
  );
}

export default React.memo(FormGroup);
