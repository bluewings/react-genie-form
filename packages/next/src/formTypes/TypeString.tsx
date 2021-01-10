import React from 'react';
import { useMemo } from 'react';

function TypeString({
  name,
  defaultValue,
  value,
  onChange,
  onBlur,
  schema,
  ...rest
}: any) {
  const type = useMemo(
    () =>
      (schema?.format || schema?.formType) === 'password' ? 'password' : 'text',
    [schema],
  );

  return (
    <input
      {...rest}
      type={type}
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      autoComplete={type === 'password' ? 'new-password' : 'off'}
    />
  );
}

export default TypeString;
