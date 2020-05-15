import * as React from 'react';
import { useMemo } from 'react';
import { Input } from 'antd';

function FormTypeTextarea({
  size,
  name,
  defaultValue,
  readOnly,
  onChange,
}: any) {
  const style = useMemo(
    () => (size === 'small' ? { padding: '1px 7px' } : {}),
    [size],
  );
  return (
    <Input.TextArea
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
      readOnly={!!readOnly}
      autoSize={{ minRows: 2, maxRows: 6 }}
      style={style}
    />
  );
}

export default FormTypeTextarea;
