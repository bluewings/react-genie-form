import * as React from 'react';
import { Slider } from 'antd';
import cx from 'classnames';
import styles from './FormTypeSlider.module.scss';

function FormTypeSlider({ size, defaultValue, onChange }: any) {
  return (
    <Slider
      className={cx(styles.root, size === 'small' && styles.small)}
      defaultValue={defaultValue}
      onAfterChange={onChange}
    />
  );
}

export default FormTypeSlider;
