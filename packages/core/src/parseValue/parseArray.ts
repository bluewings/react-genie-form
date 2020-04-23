function parseArray(value: any) {
  return Array.isArray(value) ? value : [];
}

export default parseArray;
