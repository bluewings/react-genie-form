import * as React from 'react';
import { InputNumber } from 'antd';

function TypeNumber({ name, defaultValue, onChange }: any) {
  return (
    <InputNumber name={name} defaultValue={defaultValue} onChange={onChange} />
  );
}

export default TypeNumber;
