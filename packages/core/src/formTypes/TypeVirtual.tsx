import * as React from 'react';
import { useMemo } from 'react';
import { get, identity } from 'lodash-es';
import { useFormProps, useHandle } from '../hooks';
import useIngredients from '../components/FormGroup//useIngredients';
import { getHint } from '../helpers/util';

function TypeVirtual(props: any) {
  const { schema: _schema, onChange } = props;

  const schema = useMemo(
    () => ({
      ...get(_schema, ['__schema'], {}),
      fieldsSchema: get(_schema, ['__fields'], []).map(
        ({ schema }: any) => schema,
      ),
    }),
    [_schema],
  );

  const { parseValue }: any = useFormProps();
  const parseValueFuncs = useMemo(
    () =>
      get(_schema, ['__fields'], []).map(({ schema }: any) => {
        const _parseValue = parseValue[getHint(schema).type] || identity;
        return (value: any) => _parseValue(value, undefined, schema);
      }),
    [_schema],
  );

  const handleChange = useHandle((values: any[]) => {
    onChange(
      parseValueFuncs.map((parse: any, i: number) => parse(get(values, [i]))),
    );
  });

  const { BaseFormComponent } = useIngredients(schema);

  return (
    <>
      {BaseFormComponent && (
        <BaseFormComponent {...props} schema={schema} onChange={handleChange} />
      )}
    </>
  );
}

export default TypeVirtual;
