import * as React from 'react';
import { InputNumber } from 'antd';
import { useMemo } from 'react';
import { get } from 'lodash-es';

// const identity = (e: any) => e;

const style = { minWidth: 171 };

function TypeNumber({
  schema,
  name,
  size,
  defaultValue,
  onChange,
  readOnly,
}: any) {
  const [formatter, parser] = useMemo(
    () => [
      get(schema, ['options', 'formatter']),
      get(schema, ['options', 'parser']),
    ],
    [schema],
  );

  return (
    <InputNumber
      name={name}
      size={size}
      defaultValue={defaultValue}
      onChange={onChange}
      style={style}
      formatter={formatter}
      parser={parser}
      min={schema.minimum}
      max={schema.maximum}
      readOnly={readOnly}
    />
  );
}

export default TypeNumber;
