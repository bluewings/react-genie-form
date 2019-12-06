import * as React from 'react';
import { Input } from 'antd';

function FormTypeTextarea({ name, defaultValue, onChange }: any) {
  return (
    <Input.TextArea
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
      autoSize={{ minRows: 2, maxRows: 6 }}
    />
  );
}

export default FormTypeTextarea;
