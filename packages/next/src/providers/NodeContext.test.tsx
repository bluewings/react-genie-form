import React from 'react';
import { render, screen } from '@testing-library/react';
import Form from '../components/Form';

test('using default in schema', () => {
  let received = null;
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', default: 'Harry' },
      spell: { type: 'string', default: 'Expecto Patronum' },
      grade: { type: 'number', default: 1 },
    },
  };
  render(<Form schema={schema} onChange={(value) => (received = value)} />);
  expect(received).toMatchObject({
    name: 'Harry',
    spell: 'Expecto Patronum',
    grade: 1,
  });
});

test('using default in schema (check in DOM)', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', default: 'Harry Potter' },
      grade: { type: 'number', default: 1 },
    },
  };
  render(
    <>
      <div data-testid="form1">
        <Form schema={schema} />
      </div>
      <div data-testid="form2">
        <Form
          schema={schema}
          defaultValue={{ name: 'Cedric Diggory', grade: 3 }}
        />
      </div>
    </>,
  );
  const form1 = screen.getByTestId('form1');
  const form2 = screen.getByTestId('form2');
  expect(
    (form1?.querySelector('input[type="text"]') as HTMLInputElement)?.value,
  ).toBe('Harry Potter');
  expect(
    (form1?.querySelector('input[type="number"]') as HTMLInputElement)?.value,
  ).toBe('1');
  expect(
    (form2?.querySelector('input[type="text"]') as HTMLInputElement)?.value,
  ).toBe('Cedric Diggory');
  expect(
    (form2?.querySelector('input[type="number"]') as HTMLInputElement)?.value,
  ).toBe('3');
});
