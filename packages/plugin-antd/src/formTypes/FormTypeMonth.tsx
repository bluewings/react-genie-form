import * as React from 'react';
import { DatePicker } from 'antd';
import { Moment } from 'moment';
import { useHandle } from '../hooks';

function FormTypeMonth(props: any) {
  const { name, defaultValue, onChange } = props;
  const handleChange = useHandle((moment: Moment) => {
    onChange(moment ? moment.format('YYYY-MM') : moment);
  });
  return (
    <DatePicker.MonthPicker
      name={name}
      defaultValue={defaultValue}
      onChange={handleChange}
    />
  );
}

export default FormTypeMonth;
