import React from 'react';
import styles from './ErrorSummary.module.scss';

function BaseErrorSummary({ errorsByKeyword, errors }: any) {
  return (
    <div className={styles.root}>
      <h3>ErrorSummary</h3>
      <pre>{JSON.stringify(errorsByKeyword, null, 2)}</pre>
      <pre>{JSON.stringify(errors, null, 2)}</pre>
    </div>
  );
}

export default BaseErrorSummary;
