import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react';
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
import Ajv from 'ajv';
import Form from './components/Form';
import 'antd/dist/antd.css';
// @ts-ignore
import { formTypes } from '../../plugin-antd/src';
import TypeArray from './_etc/TypeArray';

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
          watch: [
            '$.profile.name',
            '$.profile.age',
            '$.profile'
          ],
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
          <>
            <strong>
              hello '{watchvalues[0]}'
            </strong>
            <pre>
              {JSON.stringify(watchvalues, null, 2)}
            </pre>
          </>
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


export const form_types = () => {
  const [value, setValue] = useState({});
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        name: { type: 'string' },
        objectNode: {
          type: 'object',
        },
        textNode: {
          type: 'string',
        },
      },
    }
  }, []);
  const formTypeMap = useMemo(() => {
    return {
      '$.objectNode': ({ value, watchvalues, onChange }) => {
        const handleClick = () => {
          onChange({ test: 'wow' })
        }
        const handleUnsetClick = () => {
          onChange(undefined)
        }
        return (
          <div>
            <button onClick={handleClick}>object set</button>
            <button onClick={handleUnsetClick}>object unset</button>
          </div>
        )
      },
      '$.textNode': ({ value, watchvalues, onChange }) => {
        const handleClick = () => {
          onChange('wow')
        }
        return (
          <button onClick={handleClick}>text set</button>
        )
      },
    }
  }, []);

  const handleChange = (val) => {
    setValue(val);
  }
  return (
    <div>
      <Form schema={schema} formTypeMap={formTypeMap} onChange={handleChange} />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};

export const errors = () => {
  const [value, setValue] = useState({});
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        name: { type: 'string', maxLength: 3, default: 'exceed max length' },
        message: { type: 'string', minLength: 3, default: '1' },
      },
    }
  }, []);


  const handleChange = (val) => {
    setValue(val);
  }

  const [errors, setErrors] = useState([
    {
      "keyword": "maxLength",
      "dataPath": ".message",
      "schemaPath": "#/properties/slogan/maxLength",
      "params": {
        "limit": 20
      },
      "message": "should NOT be longer than 20 characters"
    }
  ]);

  const clearErrors = () => {
    setErrors([]);
  }

  return (
    <div>
      <Form schema={schema} onChange={handleChange} errors={errors} />
      <button onClick={clearErrors}>clear received errors</button>
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
    </div>
  );
};

const _formTypes = [
  {
    test: { type: 'array' },
    component: TypeArray,
  },
  ...formTypes,
];

const customRender = ({ isArrayItem, path, depth, name, errors, Input, node }: any) => {
  const isLeaf = node.children().length === 0;

  return depth === 0 ? (
    <Input />
  ) : (
    <div data-json-path={isLeaf ? path : ''}>
      <label className="form-label">{name}</label>
      <div data-input-wrap>
        <Input className="form-control" />
        {errors?.length > 0 && <em>{errors[0].message}</em>}
      </div>
    </div>
  );
};

export const arrayItems = () => {
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        // name: {
        //   type: 'string',
        // },
        descriptions: {
          type: 'array',
          items: {
            // type: 'string',
            type: 'object',
            properties: {
              name: {
                type: 'string',
              }
            }
          },
          // minItems: 2,
        },
      },
    }
  }, []);


  const [value, setValue] = useState({
    // name: 'albert',
    descriptions: [
      { name: 'description 1' },
      { name: 'description 2' },
      { name: 'description 3' },
      { name: 'description 4' },
    ],
  });




  return (
    <div>
      <Form schema={schema} formTypes={_formTypes} defaultValue={value}
        onChange={setValue}
        customRender={customRender}
      />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};


const DefaultRender = ({ isArrayItem, depth, name, errors, Input, formatError }) => {
  return depth === 0 ? (
    <Input />
  ) : (
    <div>
      <label className="form-label">{name}</label>
      <Input className="form-control" />
      <h2>
        {errors?.length > 0 ? formatError(errors[0]) : null}
      </h2>
    </div>
  );
};


export const customErrorMessage = () => {
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          maxLength: 2,
          default: 'albert'
        },
      },
    }
  }, []);

  return (
    <div>
      <Form schema={schema} formTypes={_formTypes}
        // defaultValue={value}

        // showError={true}
        // onChange={setValue}
        customRender={DefaultRender}
      />
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
    </div>
  );
};

export const usingContext = () => {
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          maxLength: 2,
          default: 'albert'
        },
      },
    }
  }, []);

  const context = useMemo(() => {
    return {
      message: 'wow'
    }
  }, []);

  const formTypeMap = useMemo(() => {
    return {
      '$.name': ({ value, watchvalues, onChange, context }) => {
        // const handleClick = () => {
        //   onChange({ test: 'wow' })
        // }
        // const handleUnsetClick = () => {
        //   onChange(undefined)
        // }
        return (
          <div>
            <h4>name</h4>
            <pre>{JSON.stringify(context, null, 2)}</pre>
            {/* <button onClick={handleClick}>object set</button>
            <button onClick={handleUnsetClick}>object unset</button> */}
          </div>
        )
      },
    }
  }, []);

  return (
    <div>
      <Form schema={schema} formTypes={_formTypes}
        // defaultValue={value}

        // showError={true}
        // onChange={setValue}
        formTypeMap={formTypeMap}
        context={context}
      />
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
    </div>
  );
};

export const readOnly = () => {
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        uri: {
          type: 'string',
          format: 'uri',
          readOnly: true,
          default: 'https://naver.com'
        },
      },
    }
  }, []);

  const [value, setValue] = useState();

  return (
    <div>
      <Form schema={schema} formTypes={_formTypes}
        onChange={setValue}
      />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};

export const errorBoundary = () => {
  const [value, setValue] = useState({});
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        nonrmal: { type: 'string' },
        error: { type: 'string' },
      },
    }
  }, []);
  const formTypeMap = useMemo(() => {
    return {
      '$.error': ({ value, watchvalues, onChange }) => {
        const handleClick = () => {
          //  onChange({ test: 'wow' })
          throw new Error('custom error');
        }
        var test; s
        console.log(test.abc);

        return (
          <div>
            <button onClick={handleClick}>make error</button>
          </div>
        )
      },
    }
  }, []);

  const handleChange = (val) => {
    setValue(val);
  }
  return (
    <div>
      <Form schema={schema} formTypeMap={formTypeMap} onChange={handleChange} />
      {/* <pre>{/JSON.stringify(value, null, 2)}</pre> */}
    </div>
  );
};

export const errorsInArray = () => {
  const [value, setValue] = useState({});
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          format: 'uri',
        },
        objectItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              link: {
                type: 'string',
                format: 'uri',
              }
            }
          }
        },
        stringItems: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uri',
          }
        }
      },
    }
  }, []);

  const defaultValue = {
    link: 'google.com',
    objectItems: [
      { link: 'google.com' },
      { link: 'http://google.com' },
      { link: 'google.com' },
    ],
    stringItems: [
      'google.com',
      'http://google.com',
      'google.com',
    ]
  }
  return (
    <div>
      <Form schema={schema} defaultValue={defaultValue} showError={true} />
    </div>
  );
};

export const clearReceivedErrorsOnChange = () => {
  const [value, setValue] = useState({});
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
          maxLength: 10,
        },
      },
    }
  }, []);

  const defaultValue = {
    name: 'google',
    email: 'someone@gmail.eom'
  }

  const errors = [
    {
      dataPath: '.email2',
      message: 'something wrong',
    }
  ]
  return (
    <div>
      <Form schema={schema} defaultValue={defaultValue} showError={true} errors={errors} />
    </div>
  );
};

export const spreadRequiredErrorsForChildren = () => {
  const [value, setValue] = useState({});
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        what: {
          type: 'string',
        },
        profile: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              maxLength: 10,
            },
          },
          required: ['name', 'email'],
        },
      },
      required: ['profile', 'what'],
    }
  }, []);


  const defaultValue = {
    profile: {
      name: 'google',
      email: 'someone@gmail.eom'
    }

  }

  const errors = [{ "keyword": "required", "dataPath": ".profile", "schemaPath": "#/properties/profile/required", "params": { "missingProperty": "name" }, "message": "should have required property 'name'" }, { "keyword": "required", "dataPath": ".profile", "schemaPath": "#/properties/profile/required", "params": { "missingProperty": "email" }, "message": "should have required property 'email'" }]
  return (
    <div>
      <Form schema={schema} defaultValue={defaultValue} showError={true}
      // errors={errors} 
      />
    </div>
  );
};

export const dirtyAndTouched = () => {
  const [value, setValue] = useState({});
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            'hello',
            'good bye',
          ]
        },
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
          maxLength: 10,
        },
      },
    }
  }, []);


  const defaultValue = {

  }

  const DefaultRender = ({ isArrayItem, depth, name, errors, Input, formatError, errorMessage, dirty, touched, showError }) => {
    // const count = useRef(0);
    // count.current++;
    return depth === 0 ? (
      <Input />
    ) : (
      <div>
        <label className="form-label">{name}</label>
        <Input className="form-control" />
        <pre>{JSON.stringify({ dirty, touched, showError })}</pre>
        {errorMessage}
        {/* {errors?.length > 0 ? formatError(errors[0]) : null} */}
        {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
      </div>
    );
  };

  // const errors = [{ "keyword": "required", "dataPath": ".profile", "schemaPath": "#/properties/profile/required", "params": { "missingProperty": "name" }, "message": "should have required property 'name'" }, { "keyword": "required", "dataPath": ".profile", "schemaPath": "#/properties/profile/required", "params": { "missingProperty": "email" }, "message": "should have required property 'email'" }]
  return (
    <div>
      <Form showError="dirty+touched" schema={schema} formTypes={formTypes} defaultValue={defaultValue} customRender={DefaultRender} />
    </div>
  );
};



export const renderCustomChildNode = () => {
  const [value, setValue] = useState({});
  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'string',
            maxLength: 5,
          },
          minItems: 2,
        },
      },
    }
  }, []);

  const formTypeMap = useMemo(() => {
    return {
      '$.items': TypeArray2,
    }
  }, []);

  // const [value, setValue] = useState(null);

  // const errors = [{ "keyword": "required", "dataPath": ".profile", "schemaPath": "#/properties/profile/required", "params": { "missingProperty": "name" }, "message": "should have required property 'name'" }, { "keyword": "required", "dataPath": ".profile", "schemaPath": "#/properties/profile/required", "params": { "missingProperty": "email" }, "message": "should have required property 'email'" }]
  return (
    <div>
      <Form schema={schema} showError={true} formTypeMap={formTypeMap} onChange={setValue} />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};


function TypeArray2({ childNodes }) {
  return childNodes.map(Node => {
    return <Node renderNode={CustomRenderNode} renderFormComponent={CustomArrayItem} />
  })
}

function CustomRenderNode({ Input, errorMessage, ...rest }) {
  console.log(rest);
  return (
    <div>
      <Input />
      {errorMessage}
      {/* <p>{errorMessage}</p> */}
    </div>
  )
}

function CustomArrayItem({ defaultValue, onChange }) {
  const handleChange = (event) => {
    if (typeof onChange === 'function') {
      onChange(event.target.value)
    }

  }
  return (
    <input type="text" onChange={handleChange} />
  )
}

export const AjvInstance = () => {
  const [value, setValue] = useState({
    text1: 'abc',
    text2: 'xyz',
  });

  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        text1: {
          type: 'string',
          excludeChars: 'x',
        },
        text2: {
          type: 'string',
          excludeChars: 'x',
        }
      },
    }
  }, []);

  const ajv = useMemo(() => {
    const ajv = new Ajv({ allErrors: true, unknownFormats: 'ignore' });
    ajv.addKeyword('excludeChars', {
      validate: (schema, data) => {
        if (typeof data === 'string' && typeof schema === 'string' && data.indexOf(schema) !== -1) {
          return false;
        }
        return true;
      },
      errors: true,
    });
    return ajv;
  }, []);

  return (
    <div>
      <Form schema={schema} ajv={ajv} defaultValue={value} showError={true} onChange={setValue} />
    </div>
  );
};

function CustomInput(props) {

  useEffect(() => {
    props.onChange('lazy update');
  }, []);

  const handleClick = () => {

    props.onChange('lazy update 2');
  }

  return (
    <button onClick={handleClick}>update</button>
  );
}

function CustomInput2({ watchvalues }) {
  return (
    <pre>
      {JSON.stringify(watchvalues)}
    </pre>
  );
}

const formTypeMap = {
  '$.value1': CustomInput,
  '$.value2': CustomInput2,
};

export const WatchValueAndLazyUpdate = () => {
  const [value, setValue] = useState({
  });

  const schema = useMemo(() => {
    return {
      type: 'object',
      properties: {
        value1: {
          type: 'string',
        },
        value2: {
          type: 'string',
          options: {
            watch: ['$.value1'],
          }
        }
      },
    }
  }, []);

  return (
    <div>
      <Form
        schema={schema}
        defaultValue={value}
        formTypeMap={formTypeMap}
        showError={true} onChange={setValue} />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};
