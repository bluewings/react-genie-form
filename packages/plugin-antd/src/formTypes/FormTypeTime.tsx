import * as React from 'react';
import { useMemo } from 'react';
import { TimePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useHandle } from '../hooks';

const dateFormat = 'HH:mm:00Z';

function FormTypeTime({ size, defaultValue, onChange }: any) {
  const handleChange = useHandle((moment: Moment) => {
    onChange(moment ? moment.format('HH:mm:00Z') : moment);
  });
  const _defaultValue = useMemo(
    () => defaultValue && moment(defaultValue, dateFormat),
    [defaultValue],
  );
  return (
    <TimePicker
      size={size}
      defaultValue={_defaultValue}
      format="HH:mm"
      onChange={handleChange}
    />
  );
}

export default FormTypeTime;
