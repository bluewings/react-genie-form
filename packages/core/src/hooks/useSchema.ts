import { useMemo } from 'react';

function useSchema(schema?: any) {
  const serialized = useMemo(() => JSON.stringify(schema), [schema]);

  const jsonSchema = useMemo(() => {
    let properties;
    try {
      properties = JSON.parse(serialized);
    } catch (e) {
      properties = {};
    }
    return typeof properties === 'object' &&
      properties.type === 'object' &&
      typeof properties.properties === 'object'
      ? properties
      : { type: 'object', properties: properties };
  }, [serialized]);

  return jsonSchema;
}

export default useSchema;
