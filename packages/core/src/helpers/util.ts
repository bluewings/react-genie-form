import { get } from 'lodash-es';

const getHint = (schema: any): Hint => ({
  type: get(schema, ['type']),
  schema,
  format: get(schema, ['options', 'format']) || get(schema, ['format']),
  formType: get(schema, ['options', 'formType']) || get(schema, ['formType']),
});

export { getHint };
