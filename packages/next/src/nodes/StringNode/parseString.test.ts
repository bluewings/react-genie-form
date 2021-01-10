import parseString from './parseString';

test('number to string', () => {
  expect(parseString(100)).toBe('100');
});

test('padded string', () => {
  expect(parseString(' padded string ')).toBe('padded string');
});

test('password format', () => {
  expect(parseString(' padded string ', { format: 'password' })).toBe(
    ' padded string ',
  );
});

test('date format', () => {
  expect(parseString(new Date(2020, 7, 15), { format: 'date' })).toBe(
    '2020-08-15',
  );
});

test('month format', () => {
  expect(parseString(new Date(2020, 7, 15), { format: 'month' })).toBe(
    '2020-08',
  );
});
