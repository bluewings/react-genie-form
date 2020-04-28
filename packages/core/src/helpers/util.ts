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

// see also: https://github.com/yahoo/react-intl/wiki/Upgrade-Guide#flatten-messages-object
const literals = ['string', 'number', 'boolean'];
const flattenMessages = (nestedMessages: any, prefix = '$') => {
  const isArray = Array.isArray(nestedMessages);
  const initObj: any = {};
  if (
    isArray &&
    nestedMessages.filter(
      (e: any) =>
        e !== null && (typeof e === 'object' || typeof e === 'function'),
    ).length === 0
  ) {
    initObj[prefix] = nestedMessages.slice();
  }
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    let prefixedKey;
    if (isArray) {
      prefixedKey = prefix ? `${prefix}[${key}]` : key;
    } else {
      prefixedKey = prefix ? `${prefix}.${key}` : key;
    }
    if (literals.indexOf(typeof value) !== -1 || value === null) {
      messages[prefixedKey] = value;
    } else if (typeof value === 'object') {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }
    return messages;
  }, initObj);
};

export { getHint, hashCode, flattenMessages };
