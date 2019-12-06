import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';

function TypeString({ name, defaultValue, onChange, schema }: any) {
  const type = useMemo(
    () =>
      get(schema, ['format'], get(schema, ['formType'])) === 'password'
        ? 'password'
        : 'text',
    [schema],
  );
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
}

export default TypeString;
