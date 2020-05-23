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
  const sliderProps = useMemo(
    () => ({
      min: get(schema, 'minimum', 0),
      max: get(schema, 'maximum', 100),
      [schema?.options?.lazy === false
        ? 'onChange'
        : 'onAfterChange']: onChange,
    }),
    [schema, onChange],
  );
  return (
    <div style={{ minWidth: 171, ...style }}>
      <Slider
        className={cx(styles.root, size === 'small' && styles.small)}
        defaultValue={defaultValue}
        {...sliderProps}
      />
    </div>
  );
}

export default FormTypeSlider;
