import * as React from 'react';
import { TimePicker } from 'antd';
import { Moment } from 'moment';
import { useHandle } from '../hooks';

function FormTypeTime(props: any) {
  const { defaultValue, onChange } = props;
  const handleChange = useHandle((moment: Moment) => {
    onChange(moment ? moment.format('HH:mm:00Z') : moment);
  });
  return (
    <TimePicker
      defaultValue={defaultValue}
      format="HH:mm"
      onChange={handleChange}
    />
  );
}

export default FormTypeTime;
