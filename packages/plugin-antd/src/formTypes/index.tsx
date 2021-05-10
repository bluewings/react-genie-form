import React from 'react';
import { Divider } from 'antd';
import BaseFormTypeCode from './FormTypeCode';
import BaseFormTypeDate from './FormTypeDate';
import BaseFormTypeDateRange from './FormTypeDateRange';
import BaseFormTypeDateTimeRange from './FormTypeDateTimeRange';
import BaseFormTypeTime from './FormTypeTime';
import BaseFormTypeMonth from './FormTypeMonth';
import BaseFormTypeMonthRange from './FormTypeMonthRange';
import BaseBaseFormTypeEnum from './FormTypeEnum';
import BaseFormTypeRadioGroup from './FormTypeRadioGroup';
import BaseFormTypeSlider from './FormTypeSlider';
import BaseFormTypeSwitch from './FormTypeSwitch';
import BaseFormTypeTextarea from './FormTypeTextarea';
import BaseFormTypeURI from './FormTypeURI';
import BaseTypeArray from './TypeArray';
import BaseTypeBoolean from './TypeBoolean';
import BaseTypeNumber from './TypeNumber';
import BaseTypeString from './TypeString';

export const FormTypeDateRange = {
  component: BaseFormTypeDateRange,
  test: { type: 'array', formType: ['date-range', 'dateRange', 'daterange'] },
};

export const FormTypeDateTimeRange = {
  component: BaseFormTypeDateTimeRange,
  test: {
    type: 'array',
    formType: ['date-time-range', 'dateTimeRange', 'datetimerange'],
  },
};

export const FormTypeMonthRange = {
  component: BaseFormTypeMonthRange,
  test: {
    type: 'array',
    formType: ['month-range', 'monthRange', 'monthrange'],
  },
};

export const FormTypeDate = {
  component: BaseFormTypeDate,
  test: { type: 'string', format: 'date' },
};

export const FormTypeTime = {
  component: BaseFormTypeTime,
  test: { type: 'string', format: 'time' },
};

export const FormTypeMonth = {
  component: BaseFormTypeMonth,
  test: { type: 'string', format: 'month' },
};

export const FormTypeSwitch = {
  component: BaseFormTypeSwitch,
  test: ({ type, schema, formType }: any) => {
    return (type === 'string' && formType === 'switch' && Array.isArray(schema?.enum) && schema?.enum.length === 2) ||
      (type === 'boolean' && formType === 'switch');
  },
};

export const FormTypeRadioGroup = {
  component: BaseFormTypeRadioGroup,
  test: ({ type, schema, formType }: any) =>
    ['string', 'number'].indexOf(type) !== -1 &&
    Array.isArray(schema.enum) &&
    ['radio', 'radiogroup'].includes(
      (formType || '').toLowerCase().replace(/[^a-z]/g, ''),
    ),
};

export const BaseFormTypeEnum = {
  component: BaseBaseFormTypeEnum,
  test: ({ type, schema }: any) => {
    return (type === 'array' && schema?.items?.type === 'string' && Array.isArray(schema?.items?.enum)) ||
      (['string', 'number'].indexOf(type) !== -1 && Array.isArray(schema.enum));
  },
};

export const FormTypeSlider = {
  component: BaseFormTypeSlider,
  test: { type: 'number', formType: 'slider' },
};

export const FormTypeTextarea = {
  component: BaseFormTypeTextarea,
  test: ({ type, format, formType }: any) => {
    return type === 'string' && (format === 'textarea' || formType === 'textarea');
  },
};

export const FormTypeURI = {
  component: BaseFormTypeURI,
  test: ({ type, format, formType }: any) => {
    return type === 'string' && (format === 'uri' || formType === 'uri');
  },
};

export const FormTypeCode = {
  component: BaseFormTypeCode,
  test: { type: 'string', formType: 'code' },
};

export const TypeArray = {
  component: BaseTypeArray,
  test: { type: 'array' },
};

export const TypeBoolean = {
  component: BaseTypeBoolean,
  test: { type: 'boolean' },
};

export const TypeString = {
  component: BaseTypeString,
  test: { type: 'string' },
};

export const TypeNumber = {
  component: BaseTypeNumber,
  test: { type: ['number', 'integer'] },
};

export const formTypes: FormType[] = [
  FormTypeDateRange,
  FormTypeDateTimeRange,
  FormTypeMonthRange,
  FormTypeDate,
  FormTypeTime,
  FormTypeMonth,
  FormTypeSwitch,
  FormTypeRadioGroup,
  BaseFormTypeEnum,
  FormTypeSlider,
  FormTypeTextarea,
  FormTypeURI,
  FormTypeCode,
  TypeArray,
  TypeBoolean,
  TypeString,
  TypeNumber,
  {
    component: () => <Divider style={{ margin: '0 0 1.5rem' }} />,
    test: { type: '__divider' },
  },
];

export default formTypes;

export const formType = {
  FormTypeCode: BaseFormTypeCode,
  FormTypeDate: BaseFormTypeDate,
  FormTypeDateRange: BaseFormTypeDateRange,
  FormTypeDateTimeRange: BaseFormTypeDateTimeRange,
  FormTypeTime: BaseFormTypeTime,
  FormTypeMonth: BaseFormTypeMonth,
  FormTypeMonthRange: BaseFormTypeMonthRange,
  FormTypeEnum: BaseBaseFormTypeEnum,
  FormTypeRadioGroup: BaseFormTypeRadioGroup,
  FormTypeSlider: BaseFormTypeSlider,
  FormTypeSwitch: BaseFormTypeSwitch,
  FormTypeTextarea: BaseFormTypeTextarea,
  FormTypeURI: BaseFormTypeURI,
  TypeArray: BaseTypeArray,
  TypeBoolean: BaseTypeBoolean,
  TypeNumber: BaseTypeNumber,
  TypeString: BaseTypeString,
};
