import React, { useState } from 'react';
// import { Provider } from '@flyer/core-client';
// import Flyer from './Flyer';
// import { flyer } from '../../data';
import Form from './components/Form';
import 'antd/dist/antd.css';
// @ts-ignore
import { plugin } from '../../plugin-antd/src';
// import flyers from '../../data/flyers.json';

export default {
  title: 'test',
  component: Form,
};

const schema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['text', 'number'],
      default: 'text',
      options: {
        alias: {
          text: 'TEXT',
        },
      },
    },
    name: {
      type: 'string',
    },
    isArray: {
      type: 'boolean',
      title: '다중항목',
      default: false,
      formType: 'switch',
    },
    isArray2: {
      type: 'boolean',
      title: '다중항목',
      default: false,
      formType: 'switch',
    },
  },
};

const _form = [
  // <h1>Name & Schedule</h1>,
  {
    name: 'type',
    'ui:label': false,
    'ui:grid': 'initial',
    'ui:style': { minWidth: 100 },
  },
  {
    name: 'name',
    'ui:label': false,
    'ui:grid': 'auto',
  },
  {
    name: 'isArray',
    // 'ui:label': false,
    'ui:grid': 'initial',
    'ui:layout': 'horizontal',
    'ui:size': 'small',
    'ui:formGroupStyle': {
      display: 'flex',
      height: 32,
      /* justify-content: center; */
      alignItems: 'center',
      flexDirection: 'row-reverse',
    },
    'ui:labelStyle': {
      marginLeft: '0.5rem',
      // background: 'yellow',
      // display: 'flex',
      // height: 32,
      // /* justify-content: center; */
      // alignItems: 'center',
      // flexDirection: 'row-reverse',
    },
    // 'ui:dependencies': ['$.type'],
    // 'ui:show': '["number"].includes($.type)',
  },
  {
    name: 'isArray2',
    // 'ui:label': false,
    'ui:grid': 'initial',
    // 'ui:layout': 'horizontal',
    // 'ui:size': 'small',
    // 'ui:dependencies': ['$.type'],
    // 'ui:show': '["number"].includes($.type)',
  },

  // '__divider',
  // { portal: '$.console.name' },
  // { name: 'testArray' },
  // { name: 'console' },

  (data) => {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  },
  // { portal: '$.console.grade' },
  // { name: 'console' },
  // <h1>Target company</h1>,
  // <h1>EventId</h1>,
  // '__divider',
  // { name: 'schedule', 'ui:label': true },
  // '__divider',
  // { name: 'age', 'ui:grid': 6 },
  // '*',
];

export const usage = () => {
  const [value, setValue] = useState({
    uri: 'https://www.google.com',
  });
  return (
    <div>
      <Form
        schema={schema}
        defaultValue={value}
        onChange={setValue}
        plugin={plugin}
        form={_form}
        // size="small"
        // layout="horizontal"
      />
      {/* <table>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top' }}>
              <Form
                schema={schema}
                defaultValue={value}
                onChange={setValue}
                plugin={plugin}
                form={_form}
                layout="horizontal"
              />
            </td>
            <td style={{ verticalAlign: 'top' }}>
              <pre>{JSON.stringify(value, null, 2)}</pre>
            </td>
          </tr>
        </tbody>
      </table> */}
    </div>
  );
};

export const form = () => {
  return (
    <Form schema={schema} plugin={plugin} form={_form} layout="horizontal" />
  );
};
