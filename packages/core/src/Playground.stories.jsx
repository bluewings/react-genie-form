import React, { useState, useMemo, useEffect } from 'react';
// import { Provider } from '@flyer/core-client';
// import Flyer from './Flyer';
// import { flyer } from '../../data';
import jsyaml from 'js-yaml';
import Form from './components/Form';
import 'antd/dist/antd.css';
// @ts-ignore
import { plugin } from '../../plugin-antd/src';
import { isUndefined } from 'lodash-es';
// import flyers from '../../data/flyers.json';

export default {
  title: 'playground',
  // component: Form,
  // decorators: [(story) => <Provider graphql="https://chirashi.line-beta.me/graphql">{story()}</Provider>],
};

const defSchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'string',
      enum: ['vertical', 'horizontal'],
      default: 'horizontal',
    },
    yamlSchema: {
      type: 'string',
      formType: 'code',
      'ui:language': 'yaml',
      default: `---
type: object
properties:
  name:
    type: string
    readOnly: true
  startDate:
    type: string
    format: month
  endDate:
    type: string
    format: month
    `,
    },
    form: {
      type: 'string',
      formType: 'code',
      'ui:language': 'js',
      default: `[
  'name',
  {
    type: '__virtual',
    name: 'schedule',
    fields: ['startDate', 'endDate'],
    formType: 'dateTimeRange',
    readOnly: true,
  },
  '*',
]
      `,
    },
  },
};

const _form = [
  // <h1>Name & Schedule</h1>,
  { name: 'name', readOnly: true },
  { name: 'schedule' },

  // '__divider',
  'testArray',
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
  const [value, setValue] = useState({});

  const { jsonSchema, errMessage, form } = useMemo(() => {
    let jsonSchema = {};
    let errMessage = '';
    let form = isUndefined;
    try {
      jsonSchema = jsyaml.load(value.yamlSchema.replace(/\t/g, '  ')) || {};
      jsonSchema = typeof jsonSchema === 'object' ? jsonSchema : {};
    } catch (err) {
      jsonSchema = {};
      errMessage = err.message;
    }
    try {
      form = jsyaml.load(value.form);
      form = Array.isArray(form) ? form : undefined;
    } catch (err) {
      form = undefined;
    }
    return { jsonSchema, errMessage, form };
  }, [value]);

  const key = useMemo(() => {
    return JSON.stringify({ jsonSchema, form });
  }, [jsonSchema, form]);

  const [value2, setValue2] = useState({});
  useEffect(() => {
    setValue2({});
  }, [key]);

  return (
    <div style={{ padding: '2rem' }}>
      <table style={{ tableLayout: 'fixed', width: '100%' }}>
        <tr>
          <td
            style={{ verticalAlign: 'top', width: '33%', paddingRight: '1rem' }}
          >
            <ErrorBoundary>
              <Form
                schema={defSchema}
                defaultValue={value}
                onChange={setValue}
                plugin={plugin}
                layout="vertical"
              />
            </ErrorBoundary>
            {errMessage}
          </td>
          <td style={{ verticalAlign: 'top', width: '67%' }} key={key}>
            <div>
              <div style={{ position: 'relative', display: 'block' }}>
                <ErrorBoundary>
                  <Form
                    schema={jsonSchema}
                    defaultValue={value2}
                    onChange={setValue2}
                    plugin={plugin}
                    form={form}
                    layout={value.layout}
                  />
                </ErrorBoundary>
                <br />
                <hr />
                <pre>{JSON.stringify(value2, null, 2)}</pre>
              </div>
            </div>
          </td>
        </tr>
      </table>
      <br />
      <hr />
      <br />
      <pre>{JSON.stringify({ jsonSchema, form }, null, 2)}</pre>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}
