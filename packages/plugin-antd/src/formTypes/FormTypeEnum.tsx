import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import { Select } from 'antd';

const { Option } = Select;

function FormTypeEnum({ size, schema, defaultValue, onChange }: any) {
  const options = useMemo(() => {
    const alias = get(schema, ['options', 'alias'], {});
    return get(schema, ['enum'], []).map((s: string, i: number) => (
      <Option key={i} value={s}>
        {alias[s] || s}
      </Option>
    ));
  }, [schema]);
  return (
    <Select
      size={size}
      defaultValue={defaultValue}
      onChange={onChange}
      style={{ minWidth: 171 }}
    >
      {options}
    </Select>
  );
}

export default FormTypeEnum;
