import React, { useMemo } from 'react';
import { get } from 'lodash-es';
import BaseErrorSummary from './BaseErrorSummary';
import useContext from '../../hooks/useContext';
import { useFormProps } from '../../hooks';

function ErrorSummaryOuter(props: any) {
  const { errors } = useContext('errors');
  const errorsByKeyword: any = useMemo(() => {
    type Grouped = { [key: string]: any[] };
    const groups: Grouped = (errors || []).reduce(
      (prev: Grouped, error: any) => ({
        ...prev,
        [error.keyword]: [...(prev[error.keyword] || []), error],
      }),
      {},
    );
    return Object.keys(groups).map((keyword) => ({
      keyword,
      message: get(groups, [keyword, 0, 'message']),
      items: get(groups, [keyword]),
    }));
  }, [errors]);

  const { ErrorSummary }: any = useFormProps();
  const ErrorSummaryInner = ErrorSummary || BaseErrorSummary;
  return (
    <ErrorSummaryInner errorsByKeyword={errorsByKeyword} errors={errors} />
  );
}

export default ErrorSummaryOuter;
