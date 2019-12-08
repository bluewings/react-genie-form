import * as React from 'react';
import { Fragment, isValidElement, useMemo } from 'react';
import FormGroup from '../components/FormGroup';
import { useFormProps, useHandle } from '../hooks';
import { get } from 'lodash-es';

function TypeObject({ path, schema, defaultValue, onChange }: any) {
  const { form, formTypes }: any = useFormProps();

  const handleChange = useHandle(onChange);

  const properties = useMemo(
    () =>
      Object.entries(get(schema, ['properties'], {})).map(
        ([name, schema]: [string, any]) => ({
          name,
          schema,
          defaultValue: get(defaultValue, [name]),
          onChange: (value: any) => handleChange({ [name]: value }),
        }),
      ),
    [schema],
  );

  const items = useMemo(() => {
    if (path === '$' && Array.isArray(form) && form.length > 0) {
      const { dict, rest } = properties.reduce(
        (prev: any, e: any) =>
          form.indexOf(e.name) !== -1
            ? { ...prev, dict: { ...prev.dict, [e.name]: e } }
            : { ...prev, rest: [...prev.rest, e] },
        { dict: {}, rest: [] },
      );
      return form
        .filter(
          (e: any, i: number, arr: any[]) =>
            arr.indexOf(e) === i || (typeof e === 'string' && e.match(/^__/)),
        )
        .reduce((items: any, e: string) => {
          if (e === '*') {
            return [...items, ...rest];
          } else if (dict[e]) {
            return [...items, dict[e]];
          } else if (typeof e === 'object' && isValidElement(e)) {
            return [...items, { reactElement: e }];
          }
          const Found = (
            formTypes.find(({ test }: any) => test({ type: e })) || {}
          ).component;
          return Found ? [...items, { reactElement: <Found /> }] : items;
        }, []);
    }
    return properties;
  }, [properties, path, form]);

  return (
    <>
      {items.map(
        (
          { defaultValue, name, onChange, reactElement, schema }: any,
          i: number,
        ) =>
          reactElement ? (
            <Fragment key={i}>{reactElement}</Fragment>
          ) : (
            <FormGroup
              defaultValue={defaultValue}
              key={i}
              name={name}
              onChange={onChange}
              parentPath={path}
              schema={schema}
            />
          ),
      )}
    </>
  );
}

export default TypeObject;
