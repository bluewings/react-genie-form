import ArrayNode from './ArrayNode';
import { IConstructorProps, Schema } from './BaseNode';
import BooleanNode from './BooleanNode';
import NumberNode from './NumberNode';
import ObjectNode from './ObjectNode';
import StringNode from './StringNode';
import VirtualNode from './VirtualNode';

function nodeFactory({
  key,
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
        key,
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        ajv,
        nodeFactory,
      });
    case 'number':
      return new NumberNode({
        key,
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        ajv,
      });
    case 'object':
      return new ObjectNode({
        key,
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        ajv,
        nodeFactory,
      });
    case 'string':
      return new StringNode({
        key,
        name,
        schema,
        defaultValue,
        parentNode,
        onChange,
        ajv,
      });
    case 'virtual':
      return new VirtualNode({
        key,
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
        key,
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
