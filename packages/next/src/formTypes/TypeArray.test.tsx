import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Form from '../components/Form';

test('click add item button', async () => {
  const MIN_ITEMS = 2;
  const N_TIMES = 3;
  const schema = {
    type: 'object',
    properties: {
      arr: {
        type: 'array',
        items: { type: 'string' },
        minItems: MIN_ITEMS,
      },
    },
  };
  const { container } = render(<Form schema={schema} />);
  expect(container.querySelectorAll('input').length).toBe(MIN_ITEMS);
  for (const {} of Array(N_TIMES).fill(true)) {
    const addButton = container.querySelector('button[title="add item"]');
    if (addButton) {
      fireEvent(
        addButton,
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
    }
  }
  expect(container.querySelectorAll('input').length).toBe(MIN_ITEMS + N_TIMES);
});

test('after changing the array item value, click add item button', async () => {
  const INPUT_VALUE = 'hello';
  const schema = {
    type: 'object',
    properties: {
      arr: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
      },
    },
  };
  const { container } = render(<Form schema={schema} />);
  (container.querySelector('input') as HTMLInputElement).value = INPUT_VALUE;
  const before = (container.querySelector('input') as HTMLInputElement).value;
  const addButton = container.querySelector('button[title="add item"]');
  if (addButton) {
    fireEvent(
      addButton,
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
  }
  const after = (container.querySelector('input') as HTMLInputElement).value;
  expect(before).toBe(INPUT_VALUE);
  expect(after).toBe(INPUT_VALUE);
});

test('check the number of change events after adding array items', () => {
  const result: any = {
    value: null,
    eventCount: 0,
  };
  const schema = {
    type: 'object',
    properties: {
      wizards: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', default: 'Harry' },
            spell: { type: 'string', default: 'Expecto Patronum' },
          },
        },
        minItems: 3,
      },
    },
  };
  const { container } = render(
    <Form
      schema={schema}
      onChange={(value) => {
        result.value = value;
        result.eventCount++;
      }}
    />,
  );
  expect(result.value.wizards.length).toBe(3);
  expect(result.eventCount).toBe(1);
  const addButton = container.querySelector('button[title="add item"]');
  if (addButton) {
    fireEvent(
      addButton,
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
  }
  expect(result.eventCount).toBe(2);
});
