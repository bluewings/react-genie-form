import React, { useState, useMemo, useEffect } from 'react';
// import { Provider } from '@flyer/core-client';
// import Flyer from './Flyer';
// import { flyer } from '../../data';
// import jsyaml from 'js-yaml';
// import Form from './components/Form';
// import 'antd/dist/antd.css';
// @ts-ignore
// import { plugin } from '../../plugin-antd/src';
// import { isUndefined } from 'lodash-es';
// import flyers from '../../data/flyers.json';
import Form from './components/Form';
import 'antd/dist/antd.css';
// @ts-ignore
import { formTypes } from '../../plugin-antd/src';

export default {
  title: 'next',
};


export const usage = () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', default: 'Harry' },
      spell: { type: 'string', default: 'Expecto Patronum' },
    },
  };
  return (
    <div>
      <Form schema={schema} formTypes={formTypes} />
    </div>
  );
};

export const grid = () => {
  const schema = {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string', formType: 'password' },
      address: { type: 'string' },
      address2: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      zip: { type: 'string' },
    },
  };
  const grid = [
    ['email', 'password'],
    // [
    //   {
    //     element: (
    //       <div style={{ background: 'yellow', textAlign: 'center' }}>
    //         - divider -
    //       </div>
    //     ),
    //     grid: 3,
    //   },
    //   <div style={{ background: 'orange', textAlign: 'center' }}>
    //     - - - divider - - -
    //   </div>,
    // ],
    // [

    //   // , <h1>address</h1>]
    //   // ,
    // ],
    'address',
    ['address2'],
    [{ name: 'city' }, { name: 'state', grid: 4 }, { name: 'zip', grid: 2 }],
    // [{ name: 'city', grid: 6 }, { name: 'state', grid: 4 }, { name: 'zip', grid: 2 }],
    // [{ name: 'city', grid: 6 }, { name: 'state', grid: 4 }, { name: 'zip' }],
    // [{ name: 'city', grid: 6 }, { name: 'state' }, { name: 'zip' }],
  ];
  return (
    <div>
      <Form schema={schema} form={grid} formTypes={formTypes} />
    </div>
  );
};

export const anyOf = () => {
  const schema = {
    type: 'object',
    anyOf: [
      {
        properties: { category: { enum: ['movie'] } },
        required: ['title', 'openingDate'],
      },
      {
        properties: { category: { enum: ['game'] } },
        required: ['title', 'releaseDate', 'numOfPlayers'],
      },
    ],
    // 각각 개별 필드의 기준으로 조건을 풀어내어야한다.
    // title
    // - ['movie'].includes(category)
    // - ['game'].includes(category)
    // openingDate
    // - ['movie'].includes(category
    // releaseDate
    // - ['game'].includes(category)
    // numOfPlayers
    // - ['game'].includes(category)
    properties: {
      category: { type: 'string', enum: ['game', 'movie'], default: 'game' },
      title: { type: 'string' },

      openingDate: {
        type: 'string',
        format: 'date',
        // 'ui:show': '@.title === "wow"',
      },
      releaseDate: {
        type: 'string',
        format: 'date',
        // 'ui:show': '@.title === "wow"',
      },
      numOfPlayers: { type: 'number' },
    },
  };
  return (
    <div>
      <Form schema={schema} formTypes={formTypes} />
    </div>
  );
};


export const watch = () => {
  const schema = {
    type: 'object',
    properties: {
      profile: {
        type: 'object',
        properties: {
          name: { type: 'string', default: 'harry' },
          age: { type: 'number', default: 10 },
        },
      },
      greeting: {
        type: 'string',
        formType: 'greeting',
        options: {
          watch: '$.profile.name',
        },
      },
    },
  };
  const _formTypes = [
    {
      test: {
        type: 'string',
        formType: 'greeting',
      },
      component: ({ value, watchvalues, onChange }) => {
        return (
          <strong>
            hello '{watchvalues[0]}'
          </strong>
        )
      }
    },
    // ...formTypes,
  ]
  return (
    <div>
      <Form schema={schema} formTypes={_formTypes} />
    </div>
  );
};
