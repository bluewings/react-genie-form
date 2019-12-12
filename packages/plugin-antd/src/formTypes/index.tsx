import * as React from 'react';
import { Divider } from 'antd';
import FormTypeEnum from './FormTypeEnum';
import FormTypeSlider from './FormTypeSlider';
import FormTypeSwitch from './FormTypeSwitch';
import FormTypeTextarea from './FormTypeTextarea';
import FormTypeURI from './FormTypeURI';
import TypeBoolean from './TypeBoolean';
import TypeDate from './TypeDate';
import TypeNumber from './TypeNumber';
import TypeString from './TypeString';

const formTypes: FormType[] = [
  {
    component: FormTypeEnum,
    test: ({ type, schema }: any) =>
      ['string', 'number'].indexOf(type) !== -1 && Array.isArray(schema.enum),
  },
  {
    component: FormTypeSlider,
    test: { type: 'number', formType: 'slider' },
  },
  {
    component: FormTypeSwitch,
    test: { type: 'boolean', formType: 'switch' },
  },
  {
    component: FormTypeTextarea,
    test: { type: 'string', format: 'textarea' },
  },
  {
    component: FormTypeTextarea,
    test: { type: 'string', formType: 'textarea' },
  },
  {
    component: FormTypeURI,
    test: { type: 'string', format: 'uri' },
  },
  {
    component: FormTypeURI,
    test: { type: 'string', formType: 'uri' },
  },
  {
    component: TypeBoolean,
    test: { type: 'boolean' },
  },
  {
    component: TypeDate,
    test: { type: 'date' },
  },
  {
    component: TypeString,
    test: { type: 'string' },
  },
  {
    component: TypeNumber,
    test: { type: 'number' },
  },
  {
    component: () => <Divider style={{ margin: '0 0 1.5rem' }} />,
    test: { type: '__divider' },
  },
];

export default formTypes;
