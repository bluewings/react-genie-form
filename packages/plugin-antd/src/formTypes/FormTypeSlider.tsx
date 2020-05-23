import * as React from 'react';
import { useMemo } from 'react';
import { Slider } from 'antd';
import { get } from 'lodash-es';
import cx from 'classnames';
import styles from './FormTypeSlider.module.scss';

function FormTypeSlider({
  size,
  defaultValue,
  schema,
  onChange,
  __ui: { style },
}: any) {
  const [min, max] = useMemo(
    () => [get(schema, 'minimum', 0), get(schema, 'maximum', 100)],
    [schema],
  );
  return (
    <div style={{ minWidth: 171, ...style }}>
      <Slider
        className={cx(styles.root, size === 'small' && styles.small)}
        defaultValue={defaultValue}
        onAfterChange={onChange}
        min={min}
        max={max}
      />
    </div>
  );
}

export default FormTypeSlider;
