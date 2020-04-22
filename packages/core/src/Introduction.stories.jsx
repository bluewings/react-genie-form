import React from 'react';
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
        // grid: 3,
        // label: false,
      },
    },
    console: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          enum: ['xbox', 'playstation', 'switch'],
          options: {
            grid: 'initial',
            // label: false,
          },
        },
        available: {
          type: 'boolean',
          formType: 'switch',
          default: false,
          options: {
            grid: 'initial',
            // label: false,
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

  '__divider',
  { name: 'console' },
  // <h1>Target company</h1>,
  // <h1>EventId</h1>,
  '__divider',
  { name: 'schedule', label: true },
  '__divider',
  { name: 'age', grid: 6 },
  '*',
];

export const usage = () => (
  <Form schema={schema} plugin={plugin} form={_form} />
);

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
