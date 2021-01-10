function parseArray(value: any): any[] {
  return Array.isArray(value) ? value : [];
}

export default parseArray;
