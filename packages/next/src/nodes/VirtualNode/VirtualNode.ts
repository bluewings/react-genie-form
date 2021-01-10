// import parseString from './parseString';
import BaseNode, { IConstructorProps } from '../BaseNode';

class VirtualNode extends BaseNode {
  readonly defaultValue: any;

  public children = () => this._children;
  public getValue = () => this._value;
  public setValue = (value: any) => this._emitChange(value);
  public parseValue = (value: any) => value;

  private _children: any[] = [];
  private _emitChange: (value: any[]) => void;
  private _value: any[];
  private _refNodes: BaseNode[];

  constructor({
    name,
    schema,
    defaultValue,
    onChange,
    parentNode,
    refNodes,
    ajv,
  }: IConstructorProps) {
    super({ name, schema, defaultValue, onChange, parentNode, ajv });
    this.defaultValue = defaultValue || [];
    this._value = this.defaultValue;
    this._refNodes = refNodes || [];

    this._refNodes.forEach((node, i: number) => {
      node.subscribe((type: string, payload: any) => {
        if (type === 'change' && this._value[i] !== payload) {
          this._value = [
            ...this._value.slice(0, i),
            payload,
            ...this._value.slice(i + 1),
          ];
          this.publish('change', this._value);
        }
      });
    });

    this._children = refNodes?.map(
      (node) => ({ node } as { node: BaseNode }),
    ) as any[];

    this._emitChange = (values: any[]) => {
      if (values.length === this._refNodes.length) {
        values.forEach((value, i) => {
          const node = this._refNodes[i];
          if (
            node.getValue() !== value &&
            typeof node.setValue === 'function'
          ) {
            node.setValue(value);
          }
        });
      }
    };
  }
}

export default VirtualNode;
