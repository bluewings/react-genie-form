import * as React from 'react';
import Form from '../../components/Form';
import styles from './Virtual.module.scss';
interface IVirtualProps {
  /**
   * Prop Description
   */
  message?: string;
}

const schema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    startDate: { type: 'string', format: 'date', default: new Date() },
    endDate: { type: 'string', format: 'date', default: new Date() },
  },
  virtual: {
    period: {
      formType: 'period',
      fields: ['startDate', 'endDate'],
    },
  },
};

const formTypeMap = {
  '$.period': ({ value, onChange }: any) => {
    const handleDate1Change = (event: any) => {
      onChange([event.target.value, value[1]]);
    };
    const handleDate2Change = (event: any) => {
      onChange([value[0], event.target.value]);
    };
    return (
      <>
        <input type="date" value={value[0]} onChange={handleDate1Change} />
        ~
        <input type="date" value={value[1]} onChange={handleDate2Change} />
      </>
    );
  },
};

const formTypes = [
  {
    test: {
      type: 'virtual',
      formType: 'period',
    },
    component: formTypeMap['$.period'],
  },
];

/**
 * Component Description
 */
function Virtual(props: IVirtualProps) {
  return (
    <div className={styles.root}>
      <h1>Virtual</h1>
      <Form
        schema={schema}
        // formTypeMap={formTypeMap}
        formTypes={formTypes}
      >
        <h3>period</h3>
        <Form.Group path="period"></Form.Group>
        <h3>startDate</h3>
        <Form.Group path="startDate"></Form.Group>
        <h3>endDate</h3>
        <Form.Group path="endDate"></Form.Group>
      </Form>
    </div>
  );
}

export default Virtual;
