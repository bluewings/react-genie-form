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

