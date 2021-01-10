import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Form from '../components/Form';

test('custom formTypes', () => {
  let value: any = { count: 0 };
  const schema = {
    type: 'object',
    properties: { count: { type: 'number' } },
  };
  const formTypes = [
    {
      test: { type: 'number' },
      component: ({ value, onChange }: any) => (
        <>
          <button
            data-testid="increase-button"
            type="button"
            onClick={() => onChange(value + 1)}
          >
            increase
          </button>
          <span>{value}</span>
        </>
      ),
    },
  ];
  const { getByTestId } = render(
    <Form
      schema={schema}
      defaultValue={value}
      formTypes={formTypes}
      onChange={(data) => (value = data)}
    />,
  );

  const N_TIMES = 3;
  const increaseButton = getByTestId('increase-button');
  if (increaseButton) {
    Array(N_TIMES)
      .fill(true)
      .forEach(() => {
        fireEvent(
          increaseButton,
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        );
      });
  }

  expect(value.count).toBe(N_TIMES);
});

test('custom formTypes (for specified path)', () => {
  let value: any = { count: 0 };
  const schema = {
    type: 'object',
    properties: { count: { type: 'number' } },
  };
  const formTypeMap = {
    '$.count': ({ value, onChange }: any) => (
      <>
        <button
          data-testid="increase-button"
          type="button"
          onClick={() => onChange(value + 1)}
        >
          increase
        </button>
        <span>{value}</span>
      </>
    ),
  };
  const { getByTestId } = render(
    <Form
      schema={schema}
      defaultValue={value}
      formTypeMap={formTypeMap}
      onChange={(data) => (value = data)}
    />,
  );

  const N_TIMES = 3;
  const increaseButton = getByTestId('increase-button');
  if (increaseButton) {
    Array(N_TIMES)
      .fill(true)
      .forEach(() => {
        fireEvent(
          increaseButton,
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        );
      });
  }

  expect(value.count).toBe(N_TIMES);
});
