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
      <Form schema={schema} />
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
      <Form schema={schema} form={grid} />
    </div>
  );
};

