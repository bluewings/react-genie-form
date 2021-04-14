import { nodeFromSchema } from '../nodeFactory';

test('default value', () => {
  const node = nodeFromSchema({
    type: 'object',
    properties: {
      character: {
        type: 'object',
        properties: {
          spell: {
            type: 'string',
            default: 'expecto patronum',
          },
        },
      },
    },
  });
  expect(node?.getValue().character.spell).toBe('expecto patronum');
});

test('anyOf', () => {
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
      category: { type: 'string', enum: ['game', 'movie'], default: 'game' },
      title: { type: 'string' },
      openingDate: { type: 'string' },
      releaseDate: { type: 'string' },
      numOfPlayers: { type: 'number', 'ui:show': '$.title === "multi"' },
    },
  };
  const node = nodeFromSchema(schema);
  expect(node?.findNode('title').schema['ui:show']).toBe(
    '("movie" === @.category) || ("game" === @.category)',
  );
  expect(node?.findNode('openingDate').schema['ui:show']).toBe(
    '"movie" === @.category',
  );
  expect(node?.findNode('releaseDate').schema['ui:show']).toBe(
    '"game" === @.category',
  );
  expect(node?.findNode('numOfPlayers').schema['ui:show']).toBe(
    '($.title === "multi") && ("game" === @.category)',
  );
});

test('sorted key order', () => {
  const schema = {
    type: 'object',
    properties: {
      category: { type: 'string' },
      title: { type: 'string' },
    },
  };
  const node = nodeFromSchema(schema);
  expect(JSON.stringify(node?.getValue())).toBe(JSON.stringify({}));
  // @ts-ignore
  node?.findNode('title').setValue('Harry Potter');
  expect(JSON.stringify(node?.getValue())).toBe(JSON.stringify({
    title: 'Harry Potter',
  }));
  // @ts-ignore
  node?.findNode('category').setValue('movie');
  expect(JSON.stringify(node?.getValue())).toBe(JSON.stringify({
    category: 'movie',
    title: 'Harry Potter',
  }));
});