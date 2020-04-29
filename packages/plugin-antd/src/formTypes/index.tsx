import * as React from 'react';
import { Divider } from 'antd';
import FormTypeCode from './FormTypeCode';
import FormTypeDate from './FormTypeDate';
import FormTypeDateRange from './FormTypeDateRange';
import FormTypeDateTimeRange from './FormTypeDateTimeRange';
import FormTypeTime from './FormTypeTime';
import FormTypeMonth from './FormTypeMonth';
import FormTypeMonthRange from './FormTypeMonthRange';
import FormTypeEnum from './FormTypeEnum';
import FormTypeSlider from './FormTypeSlider';
import FormTypeSwitch from './FormTypeSwitch';
import FormTypeTextarea from './FormTypeTextarea';
import FormTypeURI from './FormTypeURI';
import TypeArray from './TypeArray';
import TypeBoolean from './TypeBoolean';
import TypeNumber from './TypeNumber';
import TypeString from './TypeString';

const formTypes: FormType[] = [
  {
    component: FormTypeDateRange,
    test: { type: 'array', formType: ['date-range', 'dateRange', 'daterange'] },
  },
  {
    component: FormTypeDateTimeRange,
    test: {
      type: 'array',
      formType: ['date-time-range', 'dateTimeRange', 'datetimerange'],
    },
  },
  {
    component: FormTypeMonthRange,
    test: {
      type: 'array',
      formType: ['month-range', 'monthRange', 'monthrange'],
    },
  },
  {
    component: FormTypeDate,
    test: { type: 'string', format: 'date' },
  },
  {
    component: FormTypeTime,
    test: { type: 'string', format: 'time' },
  },
  {
    component: FormTypeMonth,
    test: { type: 'string', format: 'month' },
  },
  {
    component: FormTypeSwitch,
    test: ({ type, schema, formType }: any) =>
      type === 'string' &&
      formType === 'switch' &&
      Array.isArray(schema?.enum) &&
      schema?.enum.length === 2,
  },
  {
    component: FormTypeSwitch,
    test: { type: 'boolean', formType: 'switch' },
  },
  {
    component: FormTypeEnum,
    test: ({ type, schema }: any) =>
      type === 'array' &&
      schema?.items?.type === 'string' &&
      Array.isArray(schema?.items?.enum),
  },
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
    component: FormTypeCode,
    test: { type: 'string', formType: 'code' },
  },
  {
    component: TypeArray,
    test: { type: 'array' },
  },
  {
    component: TypeBoolean,
    test: { type: 'boolean' },
  },
  {
    component: TypeString,
    test: { type: 'string' },
  },
  {
    component: TypeNumber,
    test: { type: ['number', 'integer'] },
  },
  {
    component: () => <Divider style={{ margin: '0 0 1.5rem' }} />,
    test: { type: '__divider' },
  },
];

export default formTypes;
