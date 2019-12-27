import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import styles from './ErrorMessage.module.scss';

function ErrorMessage({ className, errors }: any) {
  const message = useMemo(() => get(errors, [0, 'message']), [errors]);
  return message ? (
    <p className={`${styles.root} ${className}`}>{message}</p>
  ) : null;
}

export default ErrorMessage;
