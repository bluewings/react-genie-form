import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { get } from 'lodash-es';
import BaseFormGroup from './BaseFormGroup';
import BaseLabel from '../Label';
import BaseDescription from '../Description';
import BaseErrorMessage from '../ErrorMessage';
import { useFormProps } from '../../hooks';
import { getHint } from '../../helpers/util';

const identity = (e: any) => e;

const getMessage = (e: any) => e && e.message;

function useIngredients(schema: any) {
  const {
    formTypes,
    parseValue,
    size,
    FormGroup,
    Label,
    Description,
    ErrorMessage,
    formatLabel,
    formatErrorMessage,
    formatEnum,
    showError,
  }: any = useFormProps();

  const [hint, parser]: [Hint, Function] = useMemo(
    () => [getHint(schema), get(schema, ['options', 'parser'], identity)],
    [schema],
  );

  const BaseFormComponent = useMemo(() => {
    const Found = formTypes.reduce(
      (found: any, { component, test }: any) =>
        found === null && typeof test === 'function' && test(hint)
          ? component
          : found,
      null,
    );
    if (!Found) {
      console.log(schema, hint);
    }
    return Found ? React.memo(Found) : null;
  }, [hint, formTypes]);

  const _parseValue = useCallback(
    (received: any, prevValue: any, schema: any) =>
      (parseValue[hint.type] || identity)(
        parser(received, prevValue, schema),
        prevValue,
        schema,
      ),
    [parseValue, hint.type, parser],
  );

  return {
    parseValue: _parseValue,
    size,
    BaseFormComponent,
    BaseFormGroup: FormGroup || BaseFormGroup,
    BaseLabel: Label || BaseLabel,
    BaseDescription: Description || BaseDescription,
    BaseErrorMessage: ErrorMessage || BaseErrorMessage,
    formatLabel: formatLabel || identity,
    formatErrorMessage: formatErrorMessage || getMessage,
    formatEnum: formatEnum || identity,
    showError,
  };
}

export default useIngredients;
