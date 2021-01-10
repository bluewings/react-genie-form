import React from 'react';
import NodeProxy from '../NodeProxy';

interface IFormRenderProps {
  path: string;
  children: Function;
}

function FormRender({ path, children }: IFormRenderProps) {
  return <NodeProxy path={path} renderNode={children} />;
}

export default FormRender;
