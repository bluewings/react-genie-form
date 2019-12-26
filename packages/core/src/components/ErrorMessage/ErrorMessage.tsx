import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';

function ErrorMessage({ className, errors }: any) {
  const message = useMemo(() => get(errors, [0, 'message']), [errors]);
  return message ? <p className={className}>{message}</p> : null;
}

export default ErrorMessage;
