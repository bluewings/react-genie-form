import React, { useContext } from 'react';
import FormInput from '../FormInput';
import { RenderContext } from '../../providers';

interface IFormGroupProps {
  path: string;
}

function FormGroup({ path, ...rest }: IFormGroupProps) {
  const renderNode = useContext(RenderContext);

  return <FormInput path={path} {...rest} renderNode={renderNode} />;
}

export default FormGroup;
