import parseArray from './parseArray';
import BaseNode, { IConstructorProps } from '../BaseNode';
// import nodeFactory from '../nodeFactory';

class ArrayNode extends BaseNode {
  public children = () => this._edges().map(({ source }) => source);
  public getValue = () => this._value;
  public setValue = (value: any) => this._emitChange(value);
  public parseValue = (value: any) => parseArray(value);

  private _seq = 0;
  private _ids = [] as string[];
  private _sourceMap = {} as { [key: string]: any };
  private _value: any[] | undefined;

  private _emitChange: any;
  private _ready: boolean = false;

  hasChanged: boolean = false;

  mount: boolean = false;

  onChange: Function;

  // private _subscribers: Function[] = [];

  // public subscribe = (callback: Function) => {
  //   this._subscribers.push(callback);
  //   return () => {
  //     this._subscribers = this._subscribers.filter((e) => e !== callback);
  //   };
  // };
  private _nodeFactory: any;

  constructor({
    key,
    name,
    schema,
    defaultValue,
    onChange,
    parentNode,
    ajv,
    nodeFactory,
  }: IConstructorProps) {
    super({ key, name, schema, defaultValue, onChange, parentNode, ajv });

    this._nodeFactory = nodeFactory;

    this._emitChange = () => {
      if (this._ready) {
        const value = this.toArray();
        onChange(value);
        this.publish('change', value);
      }
      return;
    };

    if (Array.isArray(defaultValue)) {
      defaultValue.forEach((e: any) => {
        this.push(e);
      });
    }

    while (this.length() < this.schema.minItems) {
      this.push();
    }

    this.mount = true;

    this.onChange = onChange;
    this._ready = true;
    this._emitChange();
  }

  public push = (data?: any) => {
    if (this.schema.maxItems && this.schema.maxItems <= this.length()) {
      return;
    }

    const id = `[${this._seq++}]`;

    const name = `${this._ids.length}`;

    this._ids.push(id);

    const handleChange = (value: any) => {
      this.update(id, value);

      if (this.mount) {
        this.onChange(this.toArray());
      }
    };
    this._sourceMap[id] = {
      node: null,
      data: data,
    };

    this._sourceMap[id].node = this._nodeFactory({
      key: id,
      name,
      schema: this.schema.items,
      defaultValue: data,
      parentNode: this,
      onChange: handleChange,
      nodeFactory: this._nodeFactory,
    });

    this.hasChanged = true;
    this._emitChange();
    return this;
  };

  public update = (id: string, data: any) => {
    if (id in this._sourceMap) {
      this._sourceMap[id].data = data;

      // if (!(this._sourceMap[id].node?.setValue)) {
      //   console.log(id, this._sourceMap);

      // }
      // this._sourceMap[id].node.setValue(data);
    }

    this.hasChanged = true;
    return this;
  };

  private updateChildName = () => {
    this._ids.forEach((id, i) => {
      if (this._sourceMap[id]?.node) {
        const node = this._sourceMap[id].node;
        const newName = `${i}`
        if (node.getName() !== newName) {
          node.setName(newName);
        }
      }
    });
  }

  public remove = (idOrIndex: string | number) => {
    let id: any =
      typeof idOrIndex === 'number' ? this._ids[idOrIndex] : idOrIndex;
    this._ids = this._ids.filter((nodeId) => nodeId !== id);
    delete this._sourceMap[id];
    this.hasChanged = true;
    this.updateChildName();
    this._emitChange();
    return this;
  };

  public clear = () => {
    this._ids = [];
    this._sourceMap = {};
    this.hasChanged = true;
    this._emitChange();
    return this;
  };

  private _edges = () =>
    this._ids.map((id) => ({ id, source: this._sourceMap[id] }));

  public toArray = () => this._edges().map(({ source }) => source?.data);

  public length = () => this._ids.length;
}

export default ArrayNode;
