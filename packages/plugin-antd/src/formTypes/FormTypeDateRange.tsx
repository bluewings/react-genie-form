import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useHandle } from '../hooks';

const dateFormat = 'YYYY-MM-DD';

function FormTypeDateRange({
  schema,
  size,
  name,
  defaultValue,
  onChange,
  readOnly,
}: any) {
  const handleChange = useHandle(([start, end]: [Moment, Moment]) => {
    onChange([
      start ? start.format(dateFormat) : start,
      end ? end.format(dateFormat) : end,
    ]);
  });
  const _defaultValue: any = useMemo(
    () =>
      Array.isArray(defaultValue) && defaultValue.length === 2
        ? [
            moment(defaultValue[0], dateFormat),
            moment(defaultValue[1], dateFormat),
          ]
        : [undefined, undefined],
    [defaultValue],
  );
  const disabled = useMemo(() => {
    const readOnly1 = get(schema, ['fieldsSchema', 0, 'readOnly'], false);
    const readOnly2 = get(schema, ['fieldsSchema', 1, 'readOnly'], false);
    if (readOnly || (readOnly1 && readOnly2)) {
      return true;
    }
    return [readOnly1, readOnly2] as [boolean, boolean];
  }, [readOnly, schema]);
  return (
    <DatePicker.RangePicker
      size={size}
      name={name}
      defaultValue={_defaultValue}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}

export default FormTypeDateRange;
