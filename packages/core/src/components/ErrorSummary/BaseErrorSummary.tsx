import React from 'react';
import styles from './ErrorSummary.module.scss';

function BaseErrorSummary({ errorsByKeyword, errors }: any) {
  return (
    <div className={styles.root}>
      {/* <h3>ErrorSummary</h3> */}
      {/* <pre>{JSON.stringify(errorsByKeyword, null, 2)}</pre>
      <pre>{JSON.stringify(errors, null, 2)}</pre> */}
      <ul className={styles.content}>
        {errorsByKeyword.map((error: any, i: number) => (
          <li key={i}>
            <p className={styles.paragraph}>{error.message}</p>
            <ul className={styles.items}>
              {error.items.map((item: any, j: number) => (
                <li key={j}>{item.dataPath}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BaseErrorSummary;
