import React, { useCallback, useMemo } from 'react';
import { Switch } from 'antd';
import cx from 'classnames';
import styles from './FormTypeSwitch.module.scss';

function FormTypeSwitch({ name, value, size, onChange, schema }: any) {
  const { on, off } = useMemo(
    () =>
      schema?.type === 'string'
        ? Object.entries(schema?.options?.alias || {}).reduce(
            (accum: any, [k, v]: any) => ({ ...accum, [v]: k }),
            {},
          )
        : { on: true, off: false },
    [schema],
  );

  const checked = useMemo(() => on === value, [on, value]);

  const handleChange = useCallback(
    (checked: boolean) => onChange(checked ? on : off),
    [on, off, onChange],
  );

  return (
    <div className={cx(styles.root, size === 'small' && styles.small)}>
      <Switch size={size} checked={checked} onChange={handleChange} />
    </div>
  );
}

export default FormTypeSwitch;
