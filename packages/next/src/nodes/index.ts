import Node, { Schema as BaseSchema } from './BaseNode';
import { nodeFromSchema } from './nodeFactory';

export type Schema = BaseSchema;

export { nodeFromSchema, Node };
