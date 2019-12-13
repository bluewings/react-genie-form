import * as React from 'react';
import { useMemo, useCallback, useRef } from 'react';
import { get, identity } from 'lodash-es';
import { useFormProps, useHandle } from '../hooks';
import useIngredients from '../components/FormGroup//useIngredients';
import { getHint } from '../helpers/util';

function TypeVirtual(props: any) {
  const { schema, onChange } = props;

  const nextProps = useMemo(
    () => ({ ...props, schema: get(schema, ['__schema'], {}) }),
    [props],
  );

  const { parseValue }: any = useFormProps();
  const parseValueFuncs = useMemo(
    () =>
      get(schema, ['__fields'], []).map(({ schema }: any) => {
        const _parseValue = parseValue[getHint(schema).type] || identity;
        return (value: any) => _parseValue(value, undefined, schema);
      }),
    [props],
  );

  const handleChange = useHandle((values: any[]) => {
    onChange(
      parseValueFuncs.map((parse: any, i: number) => parse(get(values, [i]))),
    );
  });

  const { BaseFormComponent } = useIngredients(nextProps.schema);

  return (
    <>
      {BaseFormComponent && (
        <BaseFormComponent {...nextProps} onChange={handleChange} />
      )}
    </>
  );
}

export default TypeVirtual;
