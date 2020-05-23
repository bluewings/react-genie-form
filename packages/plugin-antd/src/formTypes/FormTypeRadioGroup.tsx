import * as React from 'react';
import { useMemo } from 'react';
import { Radio } from 'antd';

function FormTypeRadioGroup({
  schema: _schema,
  defaultValue,
  onChange,
  readOnly,
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
    return (schema?.enum || []).map((value: string, i: number) => ({
      label: alias[value] || value,
      value,
    }));
  }, [schema]);
  return (
    <div style={{ padding: '6px 0 4px' }}>
      <Radio.Group
        defaultValue={defaultValue}
        options={options}
        onChange={onChange}
        disabled={readOnly}
      />
    </div>
  );
}

export default FormTypeRadioGroup;
