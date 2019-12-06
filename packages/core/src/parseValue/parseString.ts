import { get } from 'lodash-es';

// https://json-schema.org/understanding-json-schema/reference/string.html
// "date-time": Date and time together, for example, 2018-11-13T20:20:39+00:00.
// "time": New in draft 7 Time, for example, 20:20:39+00:00
// "date": New in draft 7 Date, for example, 2018-11-13.

const isPassword = (schema: any) =>
  get(schema, ['format'], get(schema, ['formType'])) === 'password';

function parseString(value: any, prevValue: any, schema: any) {
  if (isPassword(schema)) {
    return value;
  }
  return `${value}`.trim();
}

export default parseString;
