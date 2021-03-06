import React, { useCallback, useMemo } from 'react';
import { Switch } from 'antd';
import cx from 'classnames';
import styles from './FormTypeSwitch.module.scss';

const presets = {
  on: ['on', 'true', 'yes', 'active', 'y', 't'],
  off: ['off', 'false', 'no', 'paused', 'n', 'f'],
};

function FormTypeSwitch({ value, size, onChange, schema, readOnly }: any) {
  const dict = useMemo(
    () =>
      schema?.type === 'string'
        ? [
            ...Object.entries(schema?.options?.alias || {}),
            ...(schema?.enum || []).map((e: string) => [e, e]),
          ].reduce((accum: any, [k, v]: any) => {
            if (presets.on.indexOf(v.toString().toLowerCase()) !== -1) {
              return { ...accum, true: k };
            } else if (presets.off.indexOf(v.toString().toLowerCase()) !== -1) {
              return { ...accum, false: k };
            }
            return accum;
          }, {})
        : { true: true, false: false },
    [schema],
  );

  const checked = useMemo(() => dict.true === value, [dict, value]);

  const handleChange = useCallback((checked: any) => onChange(dict[checked]), [
    dict,
    onChange,
  ]);

  return (
    <div className={cx(styles.root, size === 'small' && styles.small)}>
      <Switch
        size={size}
        checked={checked}
        onChange={handleChange}
        disabled={readOnly}
      />
    </div>
  );
}

export default FormTypeSwitch;
