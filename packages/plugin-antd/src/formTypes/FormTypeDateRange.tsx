import * as React from 'react';
import { useMemo } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useHandle } from '../hooks';

const dateFormat = 'YYYY-MM-DD';

function FormTypeDate({ size, name, defaultValue, onChange }: any) {
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
  return (
    <DatePicker.RangePicker
      size={size}
      name={name}
      defaultValue={_defaultValue}
      onChange={handleChange}
    />
  );
}

export default FormTypeDate;
