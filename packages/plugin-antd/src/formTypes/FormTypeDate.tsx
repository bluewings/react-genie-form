import * as React from 'react';
import { useMemo } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useHandle } from '../hooks';

const dateFormat = 'YYYY-MM-DD';

function FormTypeDate({ size, name, defaultValue, onChange }: any) {
  const handleChange = useHandle((moment: Moment) => {
    onChange(moment ? moment.format(dateFormat) : moment);
  });
  const _defaultValue = useMemo(
    () => defaultValue && moment(defaultValue, dateFormat),
    [defaultValue],
  );
  return (
    <DatePicker
      size={size}
      name={name}
      defaultValue={_defaultValue}
      onChange={handleChange}
    />
  );
}

export default FormTypeDate;
