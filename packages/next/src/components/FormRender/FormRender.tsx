import React from 'react';
import NodeProxy from '../NodeProxy';

interface IFormRenderProps {
  path: string;
  children: Function;
}

function FormRender({ path, children, ...rest }: IFormRenderProps) {
  return <NodeProxy path={path} {...rest} renderNode={children} />;
}

export default FormRender;
