import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useHandle } from '../hooks';

const dateFormat = 'YYYY-MM';

function FormTypeMonthRange({ schema, size, name, value, onChange }: any) {
  const handleChange = useHandle((values: any) => {
    const [start, end]: [Moment, Moment] = values || [];
    onChange([
      start ? start.format(dateFormat) : start,
      end ? end.format(dateFormat) : end,
    ]);
  });
  const _value: any = useMemo(
    () =>
      (Array.isArray(value) && value.length === 2
        ? value
        : [undefined, undefined]
      ).map((e) => {
        const f = moment(e, dateFormat);
        return f.isValid() ? f : undefined;
      }),
    [value],
  );
  const disabled = useMemo(() => {
    const readOnly = get(schema, ['readOnly'], false);
    const readOnly1 = get(schema, ['fieldsSchema', 0, 'readOnly'], false);
    const readOnly2 = get(schema, ['fieldsSchema', 1, 'readOnly'], false);
    if (readOnly || (readOnly1 && readOnly2)) {
      return true;
    }
    return [readOnly1, readOnly2] as [boolean, boolean];
  }, [schema]);
  return (
    <DatePicker.RangePicker
      size={size}
      name={name}
      format={dateFormat}
      value={_value}
      picker="month"
      onChange={handleChange}
      onPanelChange={handleChange}
      disabled={disabled}
    />
  );
}

export default FormTypeMonthRange;
