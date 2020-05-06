import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useHandle } from '../hooks';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

function FormTypeDateTimeRange({
  schema,
  size,
  name,
  value,
  onChange,
  readOnly,
}: any) {
  const handleChange = useHandle((values: any) => {
    const [start, end]: [Moment, Moment] = values || [];
    onChange([
      start ? start.startOf('minute').toDate().toISOString() : start,
      end ? end.endOf('minute').toDate().toISOString() : end,
    ]);
  });
  const _value: any = useMemo(
    () =>
      (Array.isArray(value) && value.length === 2
        ? value
        : [undefined, undefined]
      ).map((e) => {
        const f = moment(new Date(e));
        return f.isValid() ? f : undefined;
      }),
    [value],
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
      format={dateTimeFormat}
      value={_value}
      showTime={{ format: 'HH:mm' }}
      onChange={handleChange}
      onPanelChange={handleChange}
      disabled={disabled}
    />
  );
}

export default FormTypeDateTimeRange;
