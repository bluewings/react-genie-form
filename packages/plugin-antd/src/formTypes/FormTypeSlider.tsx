import * as React from 'react';
import { Slider } from 'antd';
import styles from './FormTypeSlider.module.scss';

function FormTypeSlider(props: any) {
  const { defaultValue, onChange } = props;
  return (
    <Slider
      className={styles.root}
      defaultValue={defaultValue}
      onAfterChange={onChange}
    />
  );
}

export default FormTypeSlider;
