import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import { Select } from 'antd';

const { Option } = Select;

function FormTypeEnum(props: any) {
  const { schema, defaultValue, onChange } = props;
  const options = useMemo(() => {
    return get(schema, ['enum'], []).map((s: string, i: number) => {
      return (
        <Option key={i} value={s}>
          {s}
        </Option>
      );
    });
  }, [schema]);
  return (
    <Select
      defaultValue={defaultValue}
      onChange={onChange}
      style={{ minWidth: 120 }}
    >
      {options}
    </Select>
  );
}

export default FormTypeEnum;
