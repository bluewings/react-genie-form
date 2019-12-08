import * as React from 'react';
import styles from './Label.module.scss';

function Label({ className, label }: any) {
  return <label className={`${styles.root} ${className}`}>{label}</label>;
}

export default Label;
