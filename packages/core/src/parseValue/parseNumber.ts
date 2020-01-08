function parseNumber(value: any) {
  let parsed =
    typeof value === 'string' ? value.replace(/[^\d-.]/g, '') : value;
  parsed = parseFloat(parsed);
  return isNaN(parsed) ? undefined : parsed;
}

export default parseNumber;
