import { isValidElement } from 'react';
import { get } from 'lodash-es';

const getHint = (schema: any): Hint => ({
  type: get(schema, ['type']),
  schema,
  format: get(schema, ['options', 'format']) || get(schema, ['format']),
  formType: get(schema, ['options', 'formType']) || get(schema, ['formType']),
});

const safeStringify = (obj: any, options = {}) => {
  const { ignoreReact = true } = options as any;
  if (typeof obj !== 'object') {
    return obj;
  }
  return JSON.stringify(obj, (key, value) => {
    if (
      ignoreReact &&
      typeof value === 'object' &&
      value !== null &&
      isValidElement(value)
    ) {
      return undefined;
    }
    return value;
  });
};

const hashCode = (str: any) => {
  let hash = 0;
  if (typeof str === 'object' && str !== null) {
    str = safeStringify(str);
  }
  if (!str || str.length === 0) {
    return hash;
  }
  let i = 0;
  const len = str.length;
  while (i < len) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
    i++;
  }
  const base16 = hash.toString(16).replace(/[^a-z0-9]/g, '');
  const base36 = hash.toString(36).replace(/[^a-z0-9]/g, '');
  return (parseInt(base16.substr(0, 1), 16) + 10).toString(36) + base36;
};

export { getHint, hashCode };
