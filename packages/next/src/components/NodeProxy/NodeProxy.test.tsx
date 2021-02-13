import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Form from '../../components/Form';

test('ui:show prop', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      useNickName: { type: 'boolean' },
      nickname: {
        type: 'string',
        'ui:show': '$.useNickName === true',
      },
    },
  };
  const { container } = render(<Form schema={schema} />);
  expect(
    Array.from(container.querySelectorAll('label')).map(
      (label) => label.innerHTML,
    ),
  ).toMatchObject(['name', 'useNickName']);
  const checkbox = container.querySelector('input[type=checkbox]');
  if (checkbox) {
    fireEvent(
      checkbox,
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
  }
  expect(
    Array.from(container.querySelectorAll('label')).map(
      (label) => label.innerHTML,
    ),
  ).toMatchObject(['name', 'useNickName', 'nickname']);
});

test('conditional rendering by "anyOf"', async () => {
  const schema = {
    type: 'object',
    anyOf: [
      {
        properties: { category: { enum: ['movie'] } },
        required: ['title', 'openingDate'],
      },
      {
        properties: { category: { enum: ['game'] } },
        required: ['title', 'releaseDate', 'numOfPlayers'],
      },
    ],
    properties: {
      category: { type: 'string', enum: ['game', 'movie'] },
      title: { type: 'string' },
      openingDate: { type: 'string' },
      releaseDate: { type: 'string' },
      numOfPlayers: { type: 'number' },
    },
  };
  render(
    <>
      <div data-testid="form1">
        <Form schema={schema} defaultValue={{ category: 'movie' }} />
      </div>
      <div data-testid="form2">
        <Form schema={schema} defaultValue={{ category: 'game' }} />
      </div>
    </>,
  );
  expect(
    Array.from(screen.getByTestId('form1')?.querySelectorAll('label')).map(
      (label) => label.innerHTML,
    ),
  ).toMatchObject(['category', 'title', 'openingDate']);
  expect(
    Array.from(screen.getByTestId('form2')?.querySelectorAll('label')).map(
      (label) => label.innerHTML,
    ),
  ).toMatchObject(['category', 'title', 'releaseDate', 'numOfPlayers']);
});

test('watch props', async () => {
  const schema = {
    type: 'object',
    properties: {
      profile: {
        type: 'object',
        properties: {
          name: { type: 'string', default: 'harry' },
          age: { type: 'number', default: 10 },
        },
      },
      greeting: {
        type: 'string',
        formType: 'greeting',
        options: {
          watch: '$.profile.name',
        },
      },
    },
  };
  const formTypes = [
    {
      test: { type: 'string', formType: 'greeting' },
      component: ({ watchvalues }: any) => <div data-testid="message">hello "{watchvalues[0]}"</div>,
    },
  ];
  render(<Form schema={schema} formTypes={formTypes} />);
  expect(screen.getByTestId('message').innerHTML).toBe('hello "harry"');
});
