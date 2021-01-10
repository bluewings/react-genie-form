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
