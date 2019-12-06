import * as React from 'react';
import TypeDate from './TypeDate';
import TypeNumber from './TypeNumber';
import TypeObject from './TypeObject';
import TypeString from './TypeString';

const formTypes: FormType[] = [
  {
    component: TypeDate,
    test: { type: 'date' },
  },
  {
    component: TypeNumber,
    test: { type: 'number' },
  },
  {
    component: TypeObject,
    test: { type: 'object' },
  },
  {
    component: TypeString,
    test: { type: 'string' },
  },
  {
    component: () => <hr />,
    test: { type: '__divider' },
  },
];

export default formTypes;
