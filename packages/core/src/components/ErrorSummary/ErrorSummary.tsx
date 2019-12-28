import * as React from 'react';
import useContext from '../../hooks/useContext';

import styles from './ErrorSummary.module.scss';

function ErrorSummary(props: any) {
  const { errors } = useContext('errors');
  return (
    <div className={styles.root}>
      <h3>ErrorSummary</h3>
      <pre>{JSON.stringify(errors, null, 2)}</pre>
    </div>
  );
}

export default ErrorSummary;
