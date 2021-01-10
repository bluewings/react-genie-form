import React from 'react';
import { render, screen } from '@testing-library/react';
import Form from './Form';
import NodeProxy from '../NodeProxy/NodeProxy';

test('renders input elements', () => {
  const schema = {
    type: 'object',
    properties: {
      stringType: { type: 'string' },
      numberType: { type: 'number' },
      booleanType: { type: 'boolean' },
    },
  };
  const { container } = render(<Form schema={schema} />);
  expect(container.querySelectorAll('input[type="text"]').length).toBe(1);
  expect(container.querySelectorAll('input[type="number"]').length).toBe(1);
  expect(container.querySelectorAll('input[type="checkbox"]').length).toBe(1);
});

test('check the number of change events', () => {
  const eventCount = { withoutValue: 0, withValue: 0 };
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', default: 'Harry' },
      spell: { type: 'string', default: 'Expecto Patronum' },
    },
  };
  render(
    <>
      <Form schema={schema} onChange={() => eventCount.withoutValue++} />
      <Form
        schema={schema}
        onChange={() => eventCount.withValue++}
        defaultValue={{ name: 'Ron Weasley', spell: 'Lumos' }}
      />
    </>,
  );
  expect(eventCount.withoutValue).toBe(1);
  expect(eventCount.withValue).toBe(0);
});

test('Form.Group vs. Form.Input', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  };
  render(
    <>
      <div data-testid="form1">
        <Form schema={schema}>
          <Form.Group path="name" />
        </Form>
      </div>
      <div data-testid="form2">
        <Form schema={schema}>
          <Form.Input path="name" />
        </Form>
      </div>
    </>,
  );
  expect(screen.getByTestId('form1')?.querySelectorAll('label').length).toBe(1);
  expect(screen.getByTestId('form2')?.querySelectorAll('label').length).toBe(0);
});

test('form prop', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      info: {
        type: 'object',
        properties: {
          spell: { type: 'string' },
          grade: { type: 'number' },
        },
      },
    },
  };
  const form = ['info.spell', <hr />, 'name'];
  const { container } = render(<Form schema={schema} form={form} />);
  expect(
    Array.from(container.querySelectorAll('label')).map(
      (label) => label.innerHTML,
    ),
  ).toMatchObject(['spell', 'name']);
  expect(
    Array.from(container.querySelectorAll('label, hr')).map(
      (element) => element.tagName,
    ),
  ).toMatchObject(['LABEL', 'HR', 'LABEL']);
});

test('using grid', () => {
  const schema = {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string', formType: 'password' },
      address: { type: 'string' },
      address2: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      zip: { type: 'string' },
    },
  };
  const grid = [
    ['email', 'password'],
    ['address'],
    ['address2'],
    [
      { name: 'city', grid: 6 },
      { name: 'state', grid: 4 },
      { name: 'zip', grid: 2 },
    ],
  ];
  const { container } = render(<Form schema={schema} form={grid} />);

  // console.log(NodeProxy.classNames.row);
  // console.log(container.innerHTML)
  // TO BE IMPLEMENTED
});

// nested forms;
// [
//   [
//     { name: 'name', grid: 6 },
//     { name: 'grade', grid: 3 }
//   ],
//   <hr />,
//   'detail',
// ]
