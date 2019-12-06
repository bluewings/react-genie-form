import * as React from 'react';
import { Input, Select } from 'antd';

const selectBefore = (
  <Select defaultValue="http://" style={{ width: 90 }}>
    <Select.Option value="http://">http://</Select.Option>
    <Select.Option value="https://">https://</Select.Option>
  </Select>
);

function FormTypeURI(props: any) {
  return <Input addonBefore={selectBefore} defaultValue="mysite" />;
}

export default FormTypeURI;
