import * as React from 'react';
import { useMemo } from 'react';
// import { get } from 'lodash-es';
import { Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { TypeArray as BaseTypeArray } from '@react-genie-form/core';

const Add = (props: any) => {
  return (
    <Button type="dashed" icon={<PlusOutlined />} {...props}>
      Add item
    </Button>
  );
};

const Remove = ({ disabled, onClick }: any) => {
  // return <MinusCircleOutlined />;

  return (
    <Button
      type="link"
      danger
      icon={<MinusCircleOutlined />}
      disabled={disabled}
      onClick={onClick}
    />
  );
  //  icon={<DownloadOutlined />} size={size} />

  // return <Button {...props}>remove </Button>;
};

function TypeArray(props: any) {
  // const Input = useMemo(
  //   () =>
  //     get(schema, ['format'], get(schema, ['formType'])) === 'password'
  //       ? BaseInput.Password
  //       : BaseInput,
  //   [schema],
  // );
  return <BaseTypeArray {...props} Add={Add} Remove={Remove} />;
}

export default TypeArray;
