import parseNumber from './parseNumber';

test('string to number', () => {
  expect(parseNumber('-123.456')).toBe(-123.456);
});

test('unconvertible string', () => {
  expect(parseNumber('not a number')).toBe(undefined);
});
