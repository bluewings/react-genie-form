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
      format: 'date',
    },
    endDate: {
      type: 'string',
      format: 'date',
    },
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
  },
};

const _form = ['schedule', '*'];

export const usage = () => <Form schema={schema} />;

export const form = () => {
  return <Form schema={schema} plugin={plugin} form={_form} />;
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
