import * as React from 'react';
import { InputNumber } from 'antd';

function TypeNumber({ name, size, defaultValue, onChange }: any) {
  return (
    <InputNumber
      name={name}
      size={size}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
}

export default TypeNumber;
