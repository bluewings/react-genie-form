function parseObject(value: any, prevValue: any, schema: any) {
  if (typeof value === 'undefined') {
    return undefined;
  }
  return {
    ...(typeof prevValue === 'object' ? prevValue : {}),
    ...value,
  };
}

export default parseObject;
