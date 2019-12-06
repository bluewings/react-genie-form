function parseNumber(value: any) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

export default parseNumber;
