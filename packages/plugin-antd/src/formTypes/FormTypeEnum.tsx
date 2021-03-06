import * as React from 'react';
import { useMemo } from 'react';
import { Select } from 'antd';

const { Option } = Select;

function FormTypeEnum({
  size,
  schema: _schema,
  defaultValue,
  onChange,
  readOnly,
  __ui: { style },
}: any) {
  const [schema, mode]: any[] = useMemo(
    () =>
      _schema?.type === 'array'
        ? [_schema?.items, 'multiple']
        : [_schema, undefined],
    [_schema],
  );
  const options = useMemo(() => {
    const alias = schema?.options?.alias || {};
    return (schema?.enum || []).map((s: string, i: number) => (
      <Option key={i} value={s}>
        {alias[s] || s}
      </Option>
    ));
  }, [schema]);
  return (
    <Select
      mode={mode}
      size={size}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={readOnly}
      style={{ minWidth: 171, ...style }}
    >
      {options}
    </Select>
  );
}

export default FormTypeEnum;
