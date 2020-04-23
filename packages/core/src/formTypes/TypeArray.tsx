import * as React from 'react';
import { useMemo, useState, useRef } from 'react';
import { get } from 'lodash-es';
import FormGroup from '../components/FormGroup';
import { useFormProps, useHandle } from '../hooks';

function TypeArray({
  dataPath,
  name,
  value,
  defaultValue,
  onChange,
  schema,
  FormComponent,
  Label,
  Description,
  ErrorMessage,
}: any) {
  const { form, formTypes }: any = useFormProps();

  const [tick, setTick] = useState('initial');

  // console.log(form, formTypes);
  const type = useMemo(
    () =>
      get(schema, ['format'], get(schema, ['formType'])) === 'password'
        ? 'password'
        : 'text',
    [schema],
  );

  const [minItems, maxItems] = useMemo(
    () => [get(schema, ['minItems'], 0), get(schema, ['maxItems'], 100000)],

    [schema],
  );

  // console.log({
  //   FormComponent,
  //   Label,
  //   Description,
  //   ErrorMessage,
  // });

  const itemsSchema = useMemo(() => get(schema, ['items']), [schema]);
  const handleAddClick = () => {
    console.log('add');
    const prev = value || [];
    onChange([...prev, undefined]);
  };

  const handleChange = useHandle(onChange);

  const _prevVal = useMemo(() => {
    const prevVal = Array.isArray(value) ? value : [];

    while (prevVal.length < minItems) {
      prevVal.push(undefined);
    }
    return prevVal;
  }, [value]);

  const testArr = useRef<any[]>();
  testArr.current = _prevVal;

  const _value = useMemo(() => {
    // const prevVal = Array.isArray(value) ? value : [];

    // while (prevVal.length < minItems) {
    //   prevVal.push(undefined);
    // }

    // Array.isArray(value) && value.length > 0 ? value : [undefined];
    return _prevVal.map((e, i) => {
      return {
        value: e,
        onChange: (value: any, batch: boolean) => {
          // console.log(batch, prevVal, i, value);
          // const nextVal = [...(testArr.current || [])];
          testArr.current = [...(testArr.current || [])];
          testArr.current[i] = value;
          // testArr.current = nextVal[]
          handleChange(testArr.current, batch === true);
        },
        handleRemove: () => {
          // const nextVal
          if (minItems < _prevVal.length) {
            handleChange([..._prevVal.slice(0, i), ..._prevVal.slice(i + 1)]);

            setTick(Math.random().toString(36).substr(-6));
          } else {
            alert('cannot remove');
          }

          // alert('remove ' + i);
        },

        // reaceElement: (
        //   <FormGroup
        //     defaultValue={e}
        //     key={i}
        //     name={`${i}`}
        //     onChange={handleChange}
        //     parentDataPath={dataPath}
        //     // parentDataPath={`${dataPath}.${i}`}
        //     schema={itemsSchema}
        //     // isRequired={isRequired}
        //     // FormComponent={FormComponent}
        //     // Label={Label}
        //     // Description={Description}
        //     // ErrorMessage={ErrorMessage}
        //     // __misc={__misc}
        //   />
        // ),
      };
    });
  }, [_prevVal, itemsSchema, dataPath, minItems]);

  // const handleChange = () => {};

  return (
    <div key={tick}>
      {/* <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
      /> */}

      {_value.map((e, i) => {
        // return e.reactElement;
        return (
          <div key={i} style={{ display: 'flex', flex: '1 1 auto' }}>
            {/* <pre>
              {JSON.stringify(
                {
                  defaultValue: e,
                  name,
                  parentDataPath: `${dataPath}.${i}`,
                  itemsSchema,
                },
                null,
                2,
              )}
            </pre> */}

            <FormGroup
              defaultValue={e.value}
              name={`${i}`}
              onChange={e.onChange}
              parentDataPath={dataPath}
              schema={itemsSchema}
            />
            {/* <h2>[{JSON.stringify(e.value)}]</h2> */}
            {minItems < maxItems && (
              <button
                onClick={e.handleRemove}
                disabled={_value.length < minItems + 1}
              >
                del
              </button>
            )}
          </div>
        );
        // return (

        // );
      })}
      <hr />
      {minItems < maxItems && (
        <button onClick={handleAddClick} disabled={maxItems <= _value.length}>
          add
        </button>
      )}

      {/* <pre> {JSON.stringify({ _value, defaultValue }, null, 2)}</pre> */}
      <pre> {JSON.stringify(schema, null, 2)}</pre>
    </div>
  );
}

export default TypeArray;
