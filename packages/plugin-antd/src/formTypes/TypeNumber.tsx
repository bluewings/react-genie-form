import * as React from 'react';
import { InputNumber } from 'antd';
import { useMemo } from 'react';
import { get } from 'lodash-es';

const identity = (e: any) => e;

function TypeNumber({ schema, name, size, defaultValue, onChange }: any) {
  const [formatter, parser] = useMemo(
    () => [
      get(schema, ['options', 'formatter'], identity),
      get(schema, ['options', 'parser'], identity),
    ],
    [schema],
  );

  return (
    <InputNumber
      name={name}
      size={size}
      defaultValue={defaultValue}
      onChange={onChange}
      style={{ minWidth: 171 }}
      formatter={formatter}
      parser={parser}
    />
  );
}

export default TypeNumber;
