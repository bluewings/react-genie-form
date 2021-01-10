import * as React from 'react';
import Form from '../../components/Form';
import styles from './FormProps.module.scss';

interface IFormPropsProps {
  /**
   * Prop Description
   */
  message?: string;
}

const schema = {
  type: 'object',
  properties: {
    category: { type: 'string', enum: ['game', 'movie'], default: 'game' },
    title: { type: 'string' },
    openingDate: {
      type: 'string',
    },
    releaseDate: {
      type: 'string',
    },
    numOfPlayers: { type: 'number' },
  },
};

const form = ['category', 'title', <hr />, 'numOfPlayers'];

function FormProps(props: IFormPropsProps) {
  return (
    <div className={styles.root}>
      {/* <h1>FormProps</h1> */}
      <Form schema={schema} form={form} />
    </div>
  );
}

export default FormProps;
