import * as React from 'react';
import { useMemo } from 'react';
import { get } from 'lodash-es';
import BaseFormGroup from './BaseFormGroup';
import BaseLabel from '../Label';
import BaseDescription from '../Description';
import BaseErrorMessage from '../ErrorMessage';
import { useFormProps } from '../../hooks';

const identity = (e: any) => e;

function useFormComponent(schema: any) {
  const {
    formTypes,
    parseValue,
    size,
    FormGroup,
    Label,
    Description,
    ErrorMessage,
  }: any = useFormProps();

  const hint: Hint = useMemo(
    () => ({
      type: get(schema, ['type']),
      schema,
      format: get(schema, ['options', 'format']) || get(schema, ['format']),
      formType:
        get(schema, ['options', 'formType']) || get(schema, ['formType']),
    }),
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
  };
}

export default useFormComponent;
