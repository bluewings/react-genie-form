import * as React from 'react';
import styles from './Label.module.scss';

function Label({ className, formattedLabel }: any) {
  return (
    <label className={`${styles.root} ${className}`}>{formattedLabel}</label>
  );
}

export default Label;
