import * as React from 'react';
import { DatePicker } from 'antd';
import { Moment } from 'moment';
import { useHandle } from '../hooks';

function TypeDate(props: any) {
  const { name, defaultValue, onChange } = props;
  const handleChange = useHandle((moment: Moment) => {
    onChange(moment ? moment.format('YYYY-MM-DD') : moment);
  });
  return (
    <DatePicker
      name={name}
      defaultValue={defaultValue}
      onChange={handleChange}
    />
  );
}

export default TypeDate;
