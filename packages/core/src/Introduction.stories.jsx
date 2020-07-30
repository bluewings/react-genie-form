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
  title: 'react-genie-form',
  component: Form,
  // decorators: [(story) => <Provider graphql="https://chirashi.line-beta.me/graphql">{story()}</Provider>],
};

const schema = {
  type: 'object',
  options: {
    virtual: {
      schedule: {
        formType: 'dateTimeRange',
        // formType: 'dateRange',
        fields: ['startDate', 'endDate'],
        // readOnly: true
      },
    },
  },
  properties: {
    startDate: {
      type: 'string',
      format: 'date-time',
    },
    endDate: {
      type: 'string',
      format: 'date-time',
    },
    name: {
      type: 'string',
      options: {
        // 'ui:grid': 3,
        // 'ui:label': false,
      },
      formType: 'textarea',
      // readOnly: true,
    },
    uri: {
      type: 'string',
      options: {
        protocols: ['http://', 'https://', 'tel:', 'market://'],
      },
      format: 'uri',
    },
    testArray: {
      type: 'array',
      minItems: 1,
      maxItems: 5,
      readOnly: true,
      items: {
        // type: 'string',
        // default: 'abc',
        type: 'object',
        options: {
          'ui:grid': 'initial',
        },
        properties: {
          age: {
            type: 'boolean',
            formType: 'switch',
            options: {
              'ui:grid': 'initial',
              'ui:label': false,
            },
          },
          name: {
            type: 'string',
            options: {
              'ui:grid': 'initial',
              'ui:label': false,
            },
          },
        },
      },
    },
    console: {
      type: 'object',
      readOnly: true,
      properties: {
        name: {
          type: 'string',
          enum: ['xbox', 'playstation', 'switch'],
          // readOnly: true,
          options: {
            // 'ui:grid': 'initial',
            // 'ui:label': false,
          },
        },
        grade: {
          type: 'number',
          default: 5,
        },
        available: {
          type: 'boolean',
          formType: 'switch',
          default: false,
          // readOnly: true,
          options: {
            // 'ui:grid': 'initial',
            // 'ui:label': false,
          },
        },
      },
    },
    age: {
      type: 'number',
    },
  },
};

const _form = [
  // <h1>Name & Schedule</h1>,
  { name: 'name' },
  { name: 'uri' },

  // '__divider',
  // { portal: '$.console.name' },
  { name: 'testArray' },
  { name: 'console' },

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
        layout="horizontal"
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

// export const iconByPeriodCondition = () => (
//   <>
//     <Flyer flyer={flyer('coming-soon')} />
//     <Flyer flyer={flyer('start-tomorrow')} />
//     <Flyer flyer={flyer('end-today')} />
//   </>
// );

// export const onClick = () => {
//   const handleClick = (event, ui) => {
//     alert(JSON.stringify(ui, null, 2));
//   };
//   return <Flyer flyer={flyer()} onClick={handleClick} />;
// };

// onClick.story = {
//   name: 'onClick prop',
// };
