import { useMemo } from 'react';

function useSchema(schema?: any) {
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

  const jsonSchema = useMemo(() => {
    let properties;
    try {
      properties = JSON.parse(serialized, reviver);
    } catch (e) {
      properties = {};
    }
    return typeof properties === 'object' &&
      properties.type === 'object' &&
      typeof properties.properties === 'object'
      ? properties
      : { type: 'object', properties: properties };
  }, [serialized, reviver]);

  return jsonSchema;
}

export default useSchema;
