import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useHandle } from '../hooks';

const dateFormat = 'YYYY-MM';

function FormTypeMonth({ size, name, schema, defaultValue, onChange }: any) {
  const handleChange = useHandle((moment: Moment) => {
    onChange(moment ? moment.format(dateFormat) : moment);
  });
  const _defaultValue = useMemo(
    () => defaultValue && moment(defaultValue, dateFormat),
    [defaultValue],
  );
  const disabledDate = useMemo(() => {
    const disabledDateFn = get(schema, ['options', 'disabledDate']);
    return typeof disabledDateFn === 'function' ? disabledDateFn : undefined;
  }, [schema]);
  return (
    <DatePicker.MonthPicker
      size={size}
      name={name}
      defaultValue={_defaultValue}
      onChange={handleChange}
      disabledDate={disabledDate}
    />
  );
}

export default FormTypeMonth;
