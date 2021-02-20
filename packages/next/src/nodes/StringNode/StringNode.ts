import parseString from './parseString';
import BaseNode, { IConstructorProps } from '../BaseNode';

class StringNode extends BaseNode {
  readonly defaultValue: any;

  public children = () => this._children;
  public getValue = () => this._value;
  public setValue = (value: any) => this._emitChange(value);
  public parseValue = (value: any) => parseString(value, this.schema);

  private _children: any[] = [];
  private _emitChange: (value: any) => void;
  private _value: string | undefined;

  constructor({
    key,
    name,
    schema,
    defaultValue,
    onChange,
    parentNode,
    ajv,
  }: IConstructorProps) {
    super({ key, name, schema, defaultValue, onChange, parentNode, ajv });
    this.defaultValue = defaultValue;
    this._value = this.defaultValue;

    this._emitChange = (eventOrValue: Event | any) => {
      const value = this.parseValue(
        typeof eventOrValue?.target?.value !== 'undefined'
          ? eventOrValue.target.value
          : eventOrValue,
      );
      if (this._value !== value) {
        this._value = value;
        onChange(value);
        this.publish('change', value);
      }
      return undefined;
    };

    if (
      typeof defaultValue === 'undefined' &&
      typeof schema.default !== 'undefined'
    ) {
      this.defaultValue = this.parseValue(schema.default);
      this._emitChange(this.defaultValue);
    }
  }
}

export default StringNode;
