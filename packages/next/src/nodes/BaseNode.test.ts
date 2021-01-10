import { waitFor } from '@testing-library/react';
import Ajv from 'ajv';
import { nodeFromSchema } from './nodeFactory';

test('node.findNode', () => {
  const node = nodeFromSchema({
    type: 'object',
    properties: {
      house: {
        type: 'object',
        properties: {
          name: { type: 'string', default: 'Gryffindor' },
          founder: {
            type: 'object',
            properties: {
              name: { type: 'string', default: 'Godric Gryffindor' },
              yearOfBirth: { type: 'number', default: 900 },
            },
          },
        },
      },
    },
  });
  const founder = node?.findNode('house.founder');
  const founderName = founder?.findNode('name');
  expect(founder?.getValue()).toMatchObject({ name: 'Godric Gryffindor' });
  expect(node?.findNode('house.founder.name')).toBe(founderName);
  // find a relative node
  const founderBirthOfYear1 = founderName?.findNode('@.yearOfBirth');
  expect(founderBirthOfYear1?.getValue()).toBe(900);
  // find a absolute node
  const founderBirthOfYear2 = founderName?.findNode(
    '$.house.founder.yearOfBirth',
  );
  expect(founderBirthOfYear2?.getValue()).toBe(900);
});

test('validate', async () => {
  const node = nodeFromSchema({
    type: 'object',
    properties: {
      name: {
        type: 'string',
        maxLength: 5,
        pattern: '^[^A-Z]*$',
        default: 'Ron Weasley',
      },
    },
  });
  const name = node?.findNode('name');
  await waitFor(() => null, { timeout: 0 });
  expect(
    (name?.getErrors() || []).map(({ keyword }: any) => keyword),
  ).toMatchObject(['maxLength', 'pattern']);
  name?.setValue && name.setValue('ron weasley');
  await waitFor(() => null, { timeout: 0 });
  expect(
    (name?.getErrors() || []).map(({ keyword }: any) => keyword),
  ).toMatchObject(['maxLength']);
  name?.setValue && name.setValue('ron');
  await waitFor(() => null, { timeout: 0 });
  expect(name?.getErrors()).toBe(null);
});

test('validate with provided ajv', async () => {
  const ajv = new Ajv({ allErrors: true, unknownFormats: 'ignore' });

  ajv.addKeyword('isEven', {
    async: true,
    validate: async (schema: any, data: any) => data % 2 === (!!schema ? 0 : 1),
    errors: true,
  });

  const node = nodeFromSchema(
    {
      type: 'object',
      properties: {
        num: {
          type: 'number',
          isEven: true,
          default: 1,
        },
      },
    },
    { ajv },
  );
  const num = node?.findNode('num');
  await waitFor(() => null, { timeout: 0 });
  expect(num?.getErrors()?.[0]?.keyword).toBe('isEven');
  num?.setValue && num.setValue(2);
  await waitFor(() => null, { timeout: 0 });
  expect(num?.getErrors()).toBe(null);
});

test('setState, getState', async () => {
  const node = nodeFromSchema({
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
  });
  const name = node?.findNode('name');
  expect(name?.getState()).toMatchObject({});
  name?.setState((state: any) => ({ ...state, isTouched: true }));
  name?.setState({ isDirty: true });
  expect(name?.getState()).toMatchObject({ isTouched: true, isDirty: true });
  name?.setState({ isDirty: undefined });
  expect(name?.getState()).toMatchObject({ isTouched: true });
});
