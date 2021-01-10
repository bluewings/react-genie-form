import React from 'react';
import { render, screen } from '@testing-library/react';
import Form from '../components/Form';

test('using customRender 1', () => {
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
  const customRender = ({ path, Input }: any) => (
    <div>
      <label>{path}</label>
      <Input />
    </div>
  );
  const { container } = render(
    <Form schema={schema} customRender={customRender} />,
  );
  const labels = Array.from(container.querySelectorAll('label')).map(
    (elem) => elem.innerHTML,
  );
  expect(labels).toMatchObject([
    '$',
    '$.name',
    '$.sub',
    '$.sub.attr1',
    '$.sub.attr2',
  ]);
});

test('using customRender 2', () => {
  const schema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
    },
  };
  const customRender = ({ depth, name, Input }: any) => (
    <div>
      {depth > 0 && <strong>{name}</strong>}
      <Input />
    </div>
  );
  render(
    <>
      <div data-testid="form1">
        <Form schema={schema} />
      </div>
      <div data-testid="form2">
        <Form schema={schema} customRender={customRender} />
      </div>
    </>,
  );
  expect(screen.getByTestId('form1')?.querySelectorAll('strong').length).toBe(
    0,
  );
  expect(screen.getByTestId('form2')?.querySelectorAll('strong').length).toBe(
    1,
  );
});

test('using customRender (override props)', () => {
  const schema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
    },
  };
  const CUSTOM_CLASS = 'custom-class';
  const customRender = ({ Input }: any) => <Input className={CUSTOM_CLASS} />;
  render(
    <>
      <div data-testid="form1">
        <Form schema={schema} />
      </div>
      <div data-testid="form2">
        <Form schema={schema} customRender={customRender} />
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
