import React from 'react';
import NodeProxy from '../NodeProxy';

interface IFormInputProps {
  path: string;
  [key: string]: any;
}

const DefaultRenderNode = ({ Input }: any) => <Input />;

function FormInput({ path, renderNode, ...rest }: IFormInputProps) {
  return (
    <NodeProxy
      path={path}
      renderNode={renderNode || DefaultRenderNode}
      restProps={rest}
    />
  );
}

export default FormInput;
