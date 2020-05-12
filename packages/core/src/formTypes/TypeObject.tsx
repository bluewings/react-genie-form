import * as React from 'react';
import { isValidElement, useMemo, useRef } from 'react';
import FormGroup from '../components/FormGroup';
import { useFormProps, useHandle } from '../hooks';
import { get } from 'lodash-es';
import styles from './TypeObject.module.scss';
import formGroupStyles from '../components/FormGroup/FormGroup.module.scss';

const getFlexStyle = (grid: any) => {
  if (grid === 'initial') {
    return { flex: 'initial' };
  }
  let maxWidth: any =
    typeof grid === 'number'
      ? (grid / 12) * 100
      : typeof grid === 'string' && grid.match(/^[0-9]+%$/)
      ? ~~grid.replace(/%/, '')
      : 100;
  maxWidth = `${Math.min(100, maxWidth)}%`;
  return { flex: `0 0 ${maxWidth}`, maxWidth };
};

const identity = (e: any) => e;

function TypeObject({ dataPath, schema, defaultValue, value, onChange }: any) {
  const { form, formTypes }: any = useFormProps();

  const handleChange = useHandle(onChange);

  const properties = useMemo(() => {
    const required = get(schema, ['required'], []);
    return Object.entries(get(schema, ['properties'], {})).map(
      ([name, schema]: [string, any]) => ({
        name,
        schema,
        defaultValue: get(defaultValue, [name]),
        isRequired: required.indexOf(name) !== -1,
        onChange: (value: any, batch: boolean) =>
          handleChange({ [name]: value }, batch === true),
      }),
    );
  }, [schema]);

  const childNodes = useMemo(() => {
    let items;
    if (dataPath === '' && Array.isArray(form) && form.length > 0) {
      const dict = properties.reduce(
        (accum: any, property: any) => ({
          ...accum,
          [property.name]: {
            dataPath: [dataPath, property.name].join('.'),
            ...property,
          },
        }),
        {},
      );
      items = form.reduce((items: any, e: any) => {
        const { name, reactElement, renderFunc, type, fields } = e;
        if (dict[name]) {
          return [
            ...items,
            {
              ...dict[name],
              ...e,
              schema: { ...dict[name].schema, ...e.schema },
            },
          ];
        } else if (
          name === '__renderFunc' &&
          typeof renderFunc === 'function'
        ) {
          return [...items, e];
        } else if (name === '__reactElement' && isValidElement(reactElement)) {
          return [...items, { ...e, reactElement }];
        } else if (
          type === '__virtual' &&
          Array.isArray(fields) &&
          fields.length === fields.filter((name) => dict[name]).length
        ) {
          return [
            ...items,
            {
              ...e,
              schema: {
                type: '__virtual',
                __fields: fields.map((e) => dict[e]),
                __dataPaths: fields
                  .map((e: any) => get(dict, [e, 'dataPath']))
                  .filter(identity),
                __schema: { ...e, type: 'array' },
              },
              isRequired:
                fields.filter((e) => dict[e] && dict[e].isRequired).length > 0,
              defaultValue: fields.map((name: string) =>
                get(defaultValue, [name]),
              ),
              onChange: (values: any, batch: boolean) => {
                if (Array.isArray(values) && values.length === fields.length) {
                  handleChange(
                    values.reduce(
                      (accum: any, value: any, i: number) => ({
                        ...accum,
                        [fields[i]]: value,
                      }),
                      {},
                    ),
                    batch === true,
                  );
                }
              },
            },
          ];
        }
        const Found = (
          formTypes.find(({ test }: any) => test({ type: name })) || {}
        ).component;
        return Found ? [...items, { ...e, reactElement: <Found /> }] : items;
      }, []);
    } else {
      items = properties;
    }
    return items
      .map((e: any) => {
        const __ui: any = [
          ...Object.entries(e.schema || {}),
          ...Object.entries((e.schema && e.schema.options) || {}),
          ...Object.entries(e),
        ]
          .filter(([k]) => k.match(/^ui:/))
          .reduce(
            (accum, [k, v]) => ({ ...accum, [k.replace(/^ui:/, '')]: v }),
            { show: true, label: true },
          );
        // console.log('ui', __ui);
        const grid =
          e.grid ||
          // e['ui:grid'] ||
          (e.schema && e.schema.options && e.schema.options['ui:grid']);
        const showLabel = !(
          e.label === false ||
          (e.schema &&
            e.schema.options &&
            e.schema.options['ui:label'] === false)
        );
        return { style: getFlexStyle(__ui.grid), ...e, __ui };
      })
      .map((item: any) => {
        const {
          defaultValue,
          name,
          onChange,
          reactElement,
          schema,
          isRequired,
          FormComponent,
          Label,
          Description,
          ErrorMessage,
          __ui,
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
              isRequired={isRequired}
              FormComponent={FormComponent}
              Label={Label}
              Description={Description}
              ErrorMessage={ErrorMessage}
              __ui={__ui}
            />
          ),
        };
      });
  }, [properties, dataPath, form]);

  // if (dataPath === '') {
  return (
    <div className={styles.root} style={{ marginBottom: '-1.5rem' }}>
      {childNodes.map(({ style, reactElement, renderFunc }: any, i: number) => (
        <div
          className={`${styles.inner} ${formGroupStyles.grid}`}
          key={i}
          style={style}
        >
          {typeof renderFunc === 'function'
            ? renderFunc({ data: value })
            : reactElement}
        </div>
      ))}
    </div>
  );
  // }

  // return (
  //   <>
  //     {childNodes.map(({ reactElement }: any, i: number) => (
  //       <Fragment key={i}>{reactElement}</Fragment>
  //     ))}
  //   </>
  // );
}

export default TypeObject;
