import * as React from 'react';
import { useMemo } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useHandle } from '../hooks';

const dateFormat = 'YYYY-MM';

function FormTypeMonth({ size, name, defaultValue, onChange }: any) {
  const handleChange = useHandle((moment: Moment) => {
    onChange(moment ? moment.format(dateFormat) : moment);
  });
  const _defaultValue = useMemo(
    () => defaultValue && moment(defaultValue, dateFormat),
    [defaultValue],
  );
  return (
    <DatePicker.MonthPicker
      size={size}
      name={name}
      defaultValue={_defaultValue}
      onChange={handleChange}
    />
  );
}

export default FormTypeMonth;
