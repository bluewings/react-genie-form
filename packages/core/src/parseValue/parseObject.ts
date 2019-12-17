function parseObject(value: any, prevValue: any, schema: any) {
  return {
    ...(typeof prevValue === 'object' ? prevValue : {}),
    ...value,
  };
}

export default parseObject;
