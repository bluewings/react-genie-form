import * as React from 'react';
import styles from './Label.module.scss';

function Label({ className, formattedLabel, style }: any) {
  return (
    <label className={`${styles.root} ${className}`} style={style}>
      {formattedLabel}
    </label>
  );
}

export default Label;
