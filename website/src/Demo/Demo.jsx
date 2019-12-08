import * as React from 'react';
import Form from '@react-genie-form/core';
import { formTypes, Label, plugin } from '@react-genie-form/plugin-antd';
import styles from './Demo.module.scss';

const schema = {
  name: {
    type: 'string',
    title: 'Name',
    description: 'The description is displayed here.',
  },
  birth: {
    type: 'date',
  },
  gender: {
    type: 'string',
    enum: ['unknown', 'male', 'female'],
  },
  description: {
    type: 'string',
    formType: 'textarea',
  },
  etc: {
    type: 'object',
    properties: {
      interest: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    },
  },
};

const form = ['name', '__divider', 'birth'];

function Demo() {
  return (
    <div className={styles.root}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>react-genie-form</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <Form
                  layout="horizontal"
                  schema={schema}
                  plugin={plugin}
                  form={form}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <Form schema={schema} formTypes={formTypes} Label={Label} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Demo;
