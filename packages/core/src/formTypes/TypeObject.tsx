import * as React from 'react';
import { Fragment, isValidElement, useMemo } from 'react';
import FormGroup from '../components/FormGroup';
import { useFormProps, useHandle } from '../hooks';
import { get } from 'lodash-es';
import styles from './TypeObject.module.scss';

const getMaxWidth = (grid: any) => {
  const maxWidth =
    typeof grid === 'number'
      ? (grid / 12) * 100
      : typeof grid === 'string' && grid.match(/^[0-9]+%$/)
      ? ~~grid.replace(/%/, '')
      : 100;
  return `${Math.min(100, maxWidth)}%`;
};

function TypeObject({ dataPath, schema, defaultValue, onChange }: any) {
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

  const childNodes = useMemo(() => {
    let items;
    if (dataPath === '' && Array.isArray(form) && form.length > 0) {
      const dict = properties.reduce(
        (accum: any, property: any) => ({
          ...accum,
          [property.name]: property,
        }),
        {},
      );
      items = form
        .reduce((items: any, e: any) => {
          const { name, reactElement } = e;
          if (dict[name]) {
            return [...items, { ...dict[name], ...e }];
          } else if (
            name === '__reactElement' &&
            isValidElement(reactElement)
          ) {
            return [...items, { ...e, reactElement }];
          }
          const Found = (
            formTypes.find(({ test }: any) => test({ type: name })) || {}
          ).component;
          return Found ? [...items, { ...e, reactElement: <Found /> }] : items;
        }, [])
        .map((e: any) => {
          const maxWidth = getMaxWidth(e.grid);
          return { style: { flex: `0 0 ${maxWidth}`, maxWidth }, ...e };
        });
    } else {
      items = properties;
    }
    return items.map((item: any) => {
      const {
        defaultValue,
        name,
        onChange,
        reactElement,
        schema,
        FormComponent,
        Label,
        Description,
        ErrorMessage,
      } = item;
      return {
        ...item,
        reactElement: reactElement ? (
          reactElement
        ) : (
          <FormGroup
            defaultValue={defaultValue}
            name={name}
            onChange={onChange}
            parentDataPath={dataPath}
            schema={schema}
            FormComponent={FormComponent}
            Label={Label}
            Description={Description}
            ErrorMessage={ErrorMessage}
          />
        ),
      };
    });
  }, [properties, dataPath, form]);

  if (dataPath === '') {
    return (
      <div className={styles.root}>
        {childNodes.map(({ style, reactElement }: any, i: number) => (
          <div className={styles.inner} key={i} style={style}>
            {reactElement}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {childNodes.map(({ reactElement }: any, i: number) => (
        <Fragment key={i}>{reactElement}</Fragment>
      ))}
    </>
  );
}

export default TypeObject;
