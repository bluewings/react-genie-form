import ArrayNode from './ArrayNode';
import { nodeFromSchema } from '../nodeFactory';

test('automatically add items up to minItems', () => {
  const MIN_ITEMS = 5;
  const node = nodeFromSchema({
    type: 'object',
    properties: {
      arr: {
        type: 'array',
        items: {
          type: 'string',
          default: 'hello',
        },
        minItems: MIN_ITEMS,
      },
    },
  });
  expect(node?.getValue()?.arr.length).toBe(MIN_ITEMS);
});

test('add / remove / clear items', () => {
  const node = nodeFromSchema({
    type: 'object',
    properties: {
      arr: {
        type: 'array',
        items: {
          type: 'string',
          default: 'hello',
        },
      },
    },
  });
  expect(node?.getValue()?.arr).toMatchObject([]);
  (node?.findNode('arr') as ArrayNode)?.push();
  expect(node?.getValue()?.arr).toMatchObject(['hello']);
  (node?.findNode('arr') as ArrayNode)?.push('world');
  expect(node?.getValue()?.arr).toMatchObject(['hello', 'world']);
  (node?.findNode('arr') as ArrayNode)?.remove(0);
  expect(node?.getValue()?.arr).toMatchObject(['world']);
  (node?.findNode('arr') as ArrayNode)?.clear();
  expect(node?.getValue()?.arr).toMatchObject([]);
});

test('cannot exceed maxItems', () => {
  const MAX_ITEMS = 3;
  const node = nodeFromSchema({
    type: 'object',
    properties: {
      arr: {
        type: 'array',
        items: {
          type: 'string',
          default: 'hello',
        },
        maxItems: MAX_ITEMS,
      },
    },
  });
  expect(node?.getValue()?.arr).toMatchObject([]);
  Array(MAX_ITEMS + 10)
    .fill(true)
    .forEach(() => {
      (node?.findNode('arr') as ArrayNode)?.push();
    });
  expect(node?.getValue()?.arr.length).toBe(MAX_ITEMS);
});

test('array.getValue', () => {
  const node = nodeFromSchema({
    type: 'object',
    properties: {
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  }, {
    defaultValue: {
      tags: ['harry', 'ron'],
    },
  });
  expect(node?.findNode('$.tags')?.getValue()).toMatchObject(['harry', 'ron']);
  // @ts-ignore
  node?.findNode('$.tags')?.setValue(['Hermione', 'ron', 'harry']);
  expect(node?.findNode('$.tags')?.getValue()).toMatchObject(['Hermione', 'ron', 'harry']);
});

