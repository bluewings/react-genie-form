import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import { Input as BaseInput } from 'antd';

function TypeString({
  name,
  size,
  schema,
  defaultValue,
  onChange,
  readOnly,
  __ui: { style },
}: any) {
  const Input = useMemo(
    () =>
      get(schema, ['format'], get(schema, ['formType'])) === 'password'
        ? BaseInput.Password
        : BaseInput,
    [schema],
  );
  return (
    <Input
      name={name}
      size={size}
      defaultValue={defaultValue}
      readOnly={readOnly}
      onChange={onChange}
      style={{ ...style }}
    />
  );
}

export default TypeString;
