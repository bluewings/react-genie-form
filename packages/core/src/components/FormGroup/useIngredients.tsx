import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import BaseFormGroup from './BaseFormGroup';
import BaseLabel from '../Label';
import BaseDescription from '../Description';
import BaseErrorMessage from '../ErrorMessage';
import { useFormProps } from '../../hooks';
import { getHint } from '../../helpers/util';

const identity = (e: any) => e;

function useIngredients(schema: any) {
  const {
    formTypes,
    parseValue,
    size,
    FormGroup,
    Label,
    Description,
    ErrorMessage,
    showError,
  }: any = useFormProps();

  const hint: Hint = useMemo(() => getHint(schema), [schema]);

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

  const _parseValue = useMemo(() => parseValue[hint.type] || identity, [
    hint.type,
  ]);

  return {
    parseValue: _parseValue,
    size,
    BaseFormComponent,
    BaseFormGroup: FormGroup || BaseFormGroup,
    BaseLabel: Label || BaseLabel,
    BaseDescription: Description || BaseDescription,
    BaseErrorMessage: ErrorMessage || BaseErrorMessage,
    showError,
  };
}

export default useIngredients;
