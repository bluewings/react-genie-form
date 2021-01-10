import ArrayNode from './ArrayNode';
import { IConstructorProps, Schema } from './BaseNode';
import BooleanNode from './BooleanNode';
import NumberNode from './NumberNode';
import ObjectNode from './ObjectNode';
import StringNode from './StringNode';
import VirtualNode from './VirtualNode';

function nodeFactory({
  name,
  schema,
  defaultValue,
  parentNode,
  onChange,
  refNodes,
  ajv,
}: IConstructorProps) {
  switch (schema.type) {
    case 'array':
      return new ArrayNode({
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        ajv,
      });
    case 'number':
      return new NumberNode({
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        ajv,
      });
    case 'object':
      return new ObjectNode({
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        ajv,
      });
    case 'string':
      return new StringNode({
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        ajv,
      });
    case 'virtual':
      return new VirtualNode({
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        refNodes,
        ajv,
      });
    case 'boolean':
      return new BooleanNode({
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        ajv,
      });
  }
  return null;
}

interface INodeFromSchemaOptions {
  defaultValue?: any;
  onChange?: (value: any) => void;
  ajv?: any;
}

export const nodeFromSchema = (
  schema: Schema,
  options?: INodeFromSchemaOptions,
) => {
  return nodeFactory({
    name: '',
    schema,
    defaultValue: options?.defaultValue || {},
    onChange:
      typeof options?.onChange === 'function' ? options.onChange : () => null,
    ajv: options?.ajv,
  });
};

export default nodeFactory;
