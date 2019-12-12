import { get } from 'lodash-es';
import { deflateSync } from 'zlib';
import { format as dateFormat } from 'date-fns';

// https://json-schema.org/understanding-json-schema/reference/string.html
// "date-time": Date and time together, for example, 2018-11-13T20:20:39+00:00.
// "time": New in draft 7 Time, for example, 20:20:39+00:00

const getFormat = (schema: any) =>
  get(schema, ['format'], get(schema, ['formType']));

const isPassword = (schema: any) => getFormat(schema) === 'password';

const isDate = (() => {
  const formats = ['date-time', 'time', 'date'];
  return (schema: any) => formats.indexOf(getFormat(schema)) !== -1;
})();

function parseDate(value: any, prevValue: any, schema: any) {
  if (value) {
    const format = getFormat(schema);
    if (format === 'date') {
      // "date": New in draft 7 Date, for example, 2018-11-13.
      return dateFormat(new Date(value), 'yyyy-MM-dd');
    }
  }
  return value;
}

function parseString(value: any, prevValue: any, schema: any) {
  if (isPassword(schema)) {
    return value;
  } else if (isDate(schema)) {
    return parseDate(value, prevValue, schema);
  }
  return `${value}`.trim();
}

export default parseString;
