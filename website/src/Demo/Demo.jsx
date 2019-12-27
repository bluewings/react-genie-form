import * as React from 'react';
import { useState } from 'react';
import Form from '@react-genie-form/core';
import { formTypes, Label, plugin } from '@react-genie-form/plugin-antd';
import 'antd/dist/antd.css';
import styles from './Demo.module.scss';

const schema = {
  name: {
    type: 'string',
    title: 'Name',
    // description: 'The description is displayed here.',
    minLength: 3,
  },
  email: {
    type: 'string',
    pattern: '^\\S+@\\S+$',
  },
  // "date": New in draft 7 Date, for example, 2018-11-13.
  startDate: {
    type: 'string',
    format: 'date',
    // options: {
    //   disabledDate: (val) => {
    //     console.log(val);
    //     console.log(val.toDate(), typeof val.toDate());
    //     console.dir(val.toDate());
    //     return true;
    //   },
    // },
    // disabledDate
  },
  endDate: {
    type: 'string',
    format: 'month',
    customValidate: ['since-next-month', 'gte(startDate)'],
  },
  // "time": New in draft 7 Time, for example, 20:20:39+00:00
  time: {
    type: 'string',
    format: 'time',
  },
  // "date-time": Date and time together, for example, 2018-11-13T20:20:39+00:00.
  month: {
    type: 'string',
    format: 'date',
    // disabledDate:
    options: {
      disabledDate: (val) => {
        console.log(val);
        console.log(val.toDate(), typeof val.toDate());
        console.dir(val.toDate());
        return true;
      },
    },
    customValidate: 'since-next-month',
  },
  birth: {
    type: 'string',
  },
  bool: {
    type: 'boolean',
  },
  boolSwitch: {
    type: 'boolean',
    formType: 'switch',
  },
  gender: {
    type: 'string',
    enum: ['unknown', 'male', 'female'],
  },
  description: {
    type: 'string',
    formType: 'textarea',
  },
  etc: {
    type: 'object',
    properties: {
      interest: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    },
  },
};

const _schema = {
  type: 'object',
  properties: schema,
  // options: {
  //   virtual: {
  //     schedule: {
  //       formType: 'monthRange',
  //       fields: ['startDate', 'endDate'],
  //     },
  //   },
  // },
};

const form = [
  'startDate',
  'endDate',
  'month',

  'etc',
  'description',
  // 'time', '__divider', 'name', 'birth', '*'
];

const form2 = [
  // {
  //   name: ['startDate', 'endDate'],
  // },
  // {
  //   type: 'virtual',
  //   name: 'adschedule',
  //   formType: 'period',
  //   fields: ['startDate', 'endDate'],
  //   // immutable: true,
  //   // refer: 'adGroup',

  //   // virtual: {
  //   //   adSchedule: {

  //   //   },
  //   // },
  // },
  // ''
  // 'schedule',

  // '__divider',
  'month',
  // 'time',
  // '__divider',
  // // 'startDate',
  // // 'endDate',
  // // '__divider',
  // 'name',
  // 'birth',
  // '*',
];

const customStyles = {
  // label: {
  //   margin: '2px 0 0',
  //   lineHeight: '1.3125rem',
  // },
  // formGroup: {
  //   marginBottom: '0.25rem',
  // },
  isDirty: {
    background: 'orange',
  },
  isFocused: {
    background: 'lightblue',
  },
  isTouched: {
    background: 'lightgreen',
  },
};

const _value = {
  startDate: '2019-01-01',
  endDate: '2019-12-01',
  time: '12:23:00+09:00',
  month: '2019-05',
};

const customValidate = {
  // 'month:start': (...args) => {
  //   const [validatorName, data, , currentDataPath, , , root, ajv] = args;

  //   if (data && data.match(/05/)) {
  //     return true;
  //   }

  //   // console.log(args);

  //   return false;
  // },
  'since-next-month': async (
    { schema, data, parentSchema, parentData, parentDataProperty, rootData },
    context,
  ) => {
    // console.log('>> customValidate');
    return !data || new Date(data).toISOString() > new Date().toISOString()
      ? true
      : 'available from next month.';
  },
  gte: async (
    {
      schema,
      data,
      parentSchema,
      parentData,
      parentDataProperty,
      params,
      rootData,
    },
    context,
  ) => {
    const compareProperty = params[0];
    const val = parentData[compareProperty];
    return val <= data
      ? true
      : {
          message: `${parentDataProperty} must be greater than or equal to ${compareProperty}.`,
          params: {
            [parentDataProperty]: data,
            [compareProperty]: val,
          },
        };
  },
};

const errors = [
  // {
  //   keyword: 'format',
  //   dataPath: '.startDate',
  //   schemaPath: '#/properties/startDate/format',
  //   params: {
  //     format: 'date',
  //   },
  //   message: 'should match format "dat222e"',
  // },
];

function Demo() {
  const [value, setValue] = useState({});

  return (
    <div className={styles.root}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>react-genie-form</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <Form
                  layout="horizontal"
                  size="small"
                  schema={_schema}
                  plugin={plugin}
                  form={form}
                  onChange={setValue}
                  defaultValue={_value}
                  customValidate={customValidate}
                  errors={errors}
                  showError="always"
                  styles={customStyles}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <pre>{JSON.stringify(value, null, 2)}</pre>
                {/* <Form
                  layout="horizontal"
                  size="small"
                  schema={schema}
                  plugin={plugin}
                  // formTypes={formTypes}
                  // Label={Label}
                  styles={customStyles}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Demo;
