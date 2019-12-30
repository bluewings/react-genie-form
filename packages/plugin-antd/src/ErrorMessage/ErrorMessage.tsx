import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import styles from './ErrorMessage.module.scss';

function ErrorMessage({
  className,
  errors,
  error: { message, formattedMessage },
}: any) {
  // const message = useMemo(() => get(errors, [0, 'message']), [errors]);
  return formattedMessage ? (
    <p className={`${styles.root} ${className}`}>{formattedMessage}</p>
  ) : null;
}

export default ErrorMessage;
