import * as React from 'react';
import Form from '../../components/Form';
import styles from './Validate.module.scss';

interface IValidateProps {
  /**
   * Prop Description
   */
  message?: string;
}

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 20,
      default: 'Harry Potter',
    },
    friend: {
      type: 'string',
      maxLength: 5,
      default: 'Ron Weasley',
      pattern: '^[^A-Z]*$',
    },
  },
};

function Validate(props: IValidateProps) {
  return (
    <div className={styles.root}>
      <Form schema={schema} />
    </div>
  );
}

export default Validate;
