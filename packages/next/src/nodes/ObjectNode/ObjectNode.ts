import BaseNode, { IConstructorProps } from '../BaseNode';
// import nodeFactory from '../nodeFactory';

class ObjectNode extends BaseNode {
  public children = () => this._children;
  public getValue = (): any => this._value;
  // public setValue = (value?: any) => undefined;
  public setValue = (value?: any) => {
    this._draft = value;
    this._emitChange();
  };
  public parseValue = (value: any) => value;

  private _children: any[] = [];
  private _value: { [key: string]: any } | undefined;
  private _draft: { [key: string]: any };
  private _emitChange: () => void;
  private _ready: boolean = false;

  constructor({
    name,
    schema,
    defaultValue,
    onChange,
    parentNode,
    ajv,
    nodeFactory,
  }: IConstructorProps) {
    super({ name, schema, defaultValue, onChange, parentNode, ajv });

    this._value = this.defaultValue;
    this._draft = {};

    this._emitChange = () => {
      if (this._ready && (this._draft === undefined || Object.keys(this._draft).length > 0)) {
        if (this._draft === undefined) {
          this._value = undefined;
        } else {
          this._value = { ...this._value, ...this._draft };
        }
        this._draft = {};
        if (typeof onChange === 'function') {
          onChange(this._value);
          this.publish('change', this._value);
        }
      }
      return undefined;
    };

    const invertedAnyOf: { [key: string]: any[] } = {};
    if (Array.isArray(schema?.anyOf)) {
      schema.anyOf
        .filter(
          ({ properties, required }: any) =>
            properties && Array.isArray(required),
        )
        .forEach(({ properties, required }: any) => {
          const conditions = Object.entries(properties)
            .filter(([, v]: any) => Array.isArray(v?.enum) && v.enum.length > 0)
            .map(([k, v]: any) =>
              v.enum.length === 1
                ? `${JSON.stringify(v.enum[0])} === @.${k}`
                : `${JSON.stringify(v.enum)}.includes(@.${k})`,
            );
          required.forEach((field: string) => {
            invertedAnyOf[field] = [
              ...(invertedAnyOf[field] || []),
              ...conditions,
            ];
          });
        });
    }

    const virtual_referenced: { [key: string]: any } = {};
    const virtual_referencing: { [key: string]: any } = {};
    if (schema?.virtual) {
      const knownProperties = Object.keys(schema.properties || {});
      Object.entries(schema.virtual).forEach(([k, v]: any) => {
        const { fields } = v;
        const notFound = fields.find(
          (field: string) => !knownProperties.includes(field),
        );
        if (notFound) {
          throw new Error(`${notFound} is not found on properties`);
        }
        fields.forEach((field: string) => {
          virtual_referenced[field] = [...(virtual_referenced[field] || []), k];
        });
        virtual_referencing[k] = { ...v };
      });
    }

    const childMap = Object.entries(schema?.properties || {}).reduce(
      (accum, [name, schema]: any[]) => {
        accum[name] = {
          isVirtualized:
            virtual_referenced[name] && virtual_referenced[name].length > 0,
          node: nodeFactory({
            name,
            schema: invertedAnyOf[name]
              ? {
                ...schema,
                'ui:show': combineConditions(
                  [
                    schema['ui:show'],
                    combineConditions(invertedAnyOf[name], '||'),
                  ],
                  '&&',
                ),
              }
              : schema,
            parentNode: this,
            defaultValue: defaultValue?.[name],
            onChange: (value: any) => {
              if (this._draft[name] !== value || value === undefined) {
                this._draft[name] = value;
                this._emitChange();
              }
            },
          }),
        };
        return accum;
      },
      {} as { [key: string]: any },
    );

    const that = this;
    this._children = Object.entries(childMap).reduce((accum, [name, child]) => {
      if (Array.isArray(virtual_referenced[name])) {
        virtual_referenced[name].forEach((referencing: string) => {
          if (virtual_referencing[referencing]) {
            const { fields } = virtual_referencing[referencing];
            const schema = {
              type: 'virtual',
              ...virtual_referencing[referencing],
            };
            delete virtual_referencing[referencing];
            const refNodes = fields.map((field: any) => childMap[field]?.node);
            accum.push({
              node: nodeFactory({
                name: referencing,
                schema: schema,
                parentNode: that,
                refNodes: refNodes,
                defaultValue: refNodes.map(
                  (refNode: any) => refNode?.defaultValue,
                ),
                onChange: (value: any) => { },
                nodeFactory,
              }),
            });
          }
        });
      }
      accum.push(child);
      return accum;
    }, [] as any[]);

    this._ready = true;
    this._emitChange();
  }
}

export default ObjectNode;

function combineConditions(conditions: string[], oprator: string) {
  let filtered = conditions.filter(Boolean);
  if (filtered.length === 1) {
    return filtered[0];
  }
  return filtered.map((item) => `(${item})`).join(` ${oprator} `);
}
