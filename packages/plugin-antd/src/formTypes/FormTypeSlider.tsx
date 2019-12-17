import * as React from 'react';
import { useMemo } from 'react';
import { Slider } from 'antd';
import { get } from 'lodash-es';
import cx from 'classnames';
import styles from './FormTypeSlider.module.scss';

function FormTypeSlider({ size, defaultValue, schema, onChange }: any) {
  const [min, max] = useMemo(
    () => [get(schema, 'minimun', 0), get(schema, 'maximum', 0)],
    [schema],
  );
  return (
    <Slider
      className={cx(styles.root, size === 'small' && styles.small)}
      defaultValue={defaultValue}
      onAfterChange={onChange}
      min={min}
      max={max}
    />
  );
}

export default FormTypeSlider;
