import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';

function ErrorMessage({ className, errors, error: { message } }: any) {
  // const message = useMemo(() => get(errors, [0, 'message']), [errors]);
  return message ? <p className={className}>{message}</p> : null;
}

export default ErrorMessage;
