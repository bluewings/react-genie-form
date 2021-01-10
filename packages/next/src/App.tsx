import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from './components/Form';
import AnyOf from './samples/AnyOf';
import FormProps from './samples/FormProps';
import Grid from './samples/Grid';

import Validate from './samples/Validate';
// import { Input } from './components/Form/Form';
import Virtual from './samples/Virtual';
// import logo from './logo.svg';
import styles from './App.module.scss';
// import logo from './logo.svg';

const schema = {
  type: 'object',
  properties: {
    flag1: {
      type: 'boolean',
    },
    flag2: {
      type: 'boolean',
      default: true,
    },
    name: {
      type: 'string',
      default: ' albert ',
    },
    items: {
      type: 'array',
      items: {
        type: 'string',
        default: 'test',
      },
      minItems: 2,
      maxItems: 5,
    },
    objItems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          grade: {
            type: 'number',
            default: 5,
          },
          comment: {
            type: 'string',
            default: 'wow great!',
          },
        },
      },
      minItems: 2,
    },

    name2: {
      type: 'string',
      format: 'date',
      default: new Date(),
    },
    detail: {
      type: 'object',
      properties: {
        grade: {
          type: 'number',
          default: 5,
        },
        comment: {
          type: 'string',
          default: 'wow great!',
        },
        flag2: {
          type: 'boolean',
          default: true,
        },
      },
    },
  },
};

const defaultValue = {
  // flag: true,
  items: ['abcde'],
  name: 'animal crossing',
  objItems: [
    {
      comment: 'from default value',
    },
  ],
};

const schema2 = {
  type: 'object',
  properties: {
    info: {
      type: 'object',
      properties: {
        spell: { type: 'string', default: 'Expecto Patronum' },
        grade: { type: 'number', default: 1 },
      },
    },
    name: {
      type: 'string',
      default: 'Harry',
      'ui:show': '($.info.spell).match("Expecto")',
      // 'ui:show': ({ get }:any) => {

      // }
    },
  },
};

const form2 = [{ name: 'info.spell' }, 'name', 'grade'];

const customRender = ({ Input }: any) => {
  return <Input />;
};

const formTypes = [
  {
    component: ({ value, onChange }: any) => {
      const handleClick = () => {
        onChange(value + 1);
      };
      return (
        <>
          <button
            data-testid="increase-button"
            type="button"
            onClick={handleClick}
          >
            increase
          </button>
          <span>{value}</span>
        </>
      );
    },
    test: { type: 'number' },
  },
];

const Increase = ({ value, onChange }: any) => {
  const handleClick = () => {
    onChange(value + 1);
  };
  return (
    <div style={{ border: '5px solid green' }}>
      <button data-testid="increase-button" type="button" onClick={handleClick}>
        increase
      </button>
      <span>{value}</span>
    </div>
  );
};

const ttt = {
  '$.info.grade': Increase,
};

const schema3 = {
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

function App() {
  return (
    <div className={styles.root}>
      {/* <input type="range" className="form-range" id="customRange1"></input> */}
      {/* <FormProps />
      <Grid /> */}
      <Validate />
      <div className="row g-3" style={{ display: 'none' }}>
        {false && (
          <Form
            schema={schema3}
            // form={form2}
            // defaultValue={defaultValue}
            // customRender={customRender}
            // formTypes={formTypes}
            // formTypeMap={ttt}
          >
            {/* <h2>info</h2>
        <Form.Input path="info" />
        <hr />
        <h2>name</h2>
        <Form.Input path="name" />
        <Form.Render path="">
          {({ Input }: any) => {


            return (
              <>
                <h1>test render</h1>
                <Input style={{
                  background: 'cyan'
                }} />
              </>
            )
          }}
        </Form.Render> */}
            {/* <Form.Input path="detail.comment" style={{
          background: 'yellow',
          padding: 10,
          fontSize: 50,

        }}
        // spellCheck={false}
        />
        <Form.Group path="$.detail.comment"

        /> */}
            {/* <hr /> */}
            {/* <Form.Group path="name" /> */}
            {/* <Form.Render path="name">
          {({ Input }: any) => {


            return (
              <>
                <h1>test render</h1>
                <Input style={{
                  background: 'cyan'
                }} />
              </>
            )
          }}
        </Form.Render> */}

            {/* <hr />
        <Form.Input path="items" />
        <hr />
        <Form.Input path="detail" />
        <hr />
        <Form.Input path="detail.grade" /> */}
          </Form>
        )}
      </div>
    </div>
  );
}

export default App;
