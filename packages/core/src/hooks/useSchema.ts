import { useMemo } from 'react';

function useSchema(schema?: any, required?: string[]) {
  const [serialized, reviver] = useMemo(() => {
    const local: any = {};
    const replacer = (key: any, value: any) => {
      if (typeof value === 'function') {
        const id =
          '__func_value_' +
          Math.random()
            .toFixed(36)
            .substr(-8);
        local[id] = value;
        return id;
      }
      return value;
    };
    const serialized = JSON.stringify(schema, replacer, 2);
    const reviver = (key: string, value: any) =>
      typeof value === 'string' && typeof local[value] === 'function'
        ? local[value]
        : value;
    return [serialized, reviver];
  }, [schema]);

  const requiredStr = useMemo(() => JSON.stringify(required), [required]);
  const jsonSchema = useMemo(() => {
    let properties;
    try {
      properties = JSON.parse(serialized, reviver);
    } catch (e) {
      properties = {};
    }
    let schema =
      typeof properties === 'object' &&
      properties.type === 'object' &&
      typeof properties.properties === 'object'
        ? properties
        : { type: 'object', properties: properties };
    return {
      ...schema,
      required: [...(schema.required || []), ...(required || [])].filter(
        (e: string, i: number, arr: string[]) =>
          arr.indexOf(e) === i && schema.properties[e],
      ),
    };
  }, [serialized, reviver, requiredStr]);

  return jsonSchema;
}

export default useSchema;
