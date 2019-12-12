import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';

function TypeDate({ name, defaultValue, onChange, schema }: any) {
  const type = useMemo(() => get(schema, ['format'], 'date'), [schema]);
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
}

export default TypeDate;
