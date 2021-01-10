import { format as dateFormat } from 'date-fns';

const parseValue = (value: any, schema?: any): string | undefined => {
  if (typeof value === 'undefined') {
    return undefined;
  }
  if (isDate(schema)) {
    return parseDate(value, getFormat(schema));
  }
  if (isPassword(schema)) {
    return `${value}`;
  }
  return `${value}`.trim();
};

export default parseValue;

const getFormat = (schema: any): string =>
  schema?.format || schema?.formType || 'unknown';

const isPassword = (schema: any) => getFormat(schema) === 'password';

const isDate = (() => {
  const formats = ['date-time', 'time', 'date', 'month'];
  return (schema: any) => formats.includes(getFormat(schema));
})();

// https://json-schema.org/understanding-json-schema/reference/string.html
// "date-time": Date and time together, for example, 2018-11-13T20:20:39+00:00.

// const parseDate = (value: any, prevValue: any, schema: any) => {
const parseDate = (value: any, format: string) => {
  try {
    if (value) {
      if (format === 'date') {
        // "date": New in draft 7 Date, for example, 2018-11-13.
        return dateFormat(new Date(value), 'yyyy-MM-dd');
      } else if (format === 'month') {
        return dateFormat(new Date(value), 'yyyy-MM');
      } else if (format === 'time') {
        // "time": New in draft 7 Time, for example, 20:20:39+00:00
        if (value.match(/^[0-9]{2}:[0-9]{2}:[0-9]{2}[-+][0-9]{2}:[0-9]{2}/)) {
          return value;
        }
        const [, hh, mm, , ss] =
          value.match(/^([0-9]{1,2}):([0-9]{2})(:([0-9]{2})){0,1}$/) || [];
        if (typeof hh !== 'undefined' && typeof mm !== 'undefined') {
          const date = new Date();
          date.setHours(~~hh);
          date.setMinutes(~~mm);
          date.setSeconds(~~ss);
          return dateFormat(date, 'HH:mm:ssxxx');
        }
      }
    }
  } catch {
    return undefined;
  }
  return value;
};
