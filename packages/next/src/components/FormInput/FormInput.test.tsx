import React from 'react';
import { render, screen } from '@testing-library/react';
import Form from '../Form';

test('render only specific nodes', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      sub: {
        type: 'object',
        properties: {
          attr1: { type: 'string' },
          attr2: { type: 'string' },
        },
      },
    },
  };
  const { container } = render(
    <Form schema={schema}>
      <div data-testid="wrap">
        <Form.Input path="name" />
      </div>
      <Form.Input path="sub.attr1" />
    </Form>,
  );
  const wrapElement = screen.getByTestId('wrap');
  expect(wrapElement).toBeInTheDocument();
  expect(wrapElement.querySelectorAll('input[type="text"]').length).toBe(1);
  expect(container.querySelectorAll('input[type="text"]').length).toBe(2);
});

test('render the provided children (override props)', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  };
  const CUSTOM_CLASS = 'custom-class';
  render(
    <>
      <div data-testid="form1">
        <Form schema={schema} />
      </div>
      <div data-testid="form2">
        <Form schema={schema}>
          <Form.Input path="name" className={CUSTOM_CLASS} />
        </Form>
      </div>
    </>,
  );
  expect(
    (screen
      .getByTestId('form1')
      ?.querySelector('input') as HTMLElement).classList.contains(CUSTOM_CLASS),
  ).toBe(false);
  expect(
    (screen
      .getByTestId('form2')
      ?.querySelector('input') as HTMLElement).classList.contains(CUSTOM_CLASS),
  ).toBe(true);
});
