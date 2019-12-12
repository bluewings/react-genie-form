import * as React from 'react';
import { Switch } from 'antd';
import cx from 'classnames';
import styles from './FormTypeSwitch.module.scss';

function FormTypeSwitch({ name, value, size, onChange, schema }: any) {
  return (
    <div className={cx(styles.root, size === 'small' && styles.small)}>
      <Switch size={size} checked={!!value} onChange={onChange} />
    </div>
  );
}

export default FormTypeSwitch;
