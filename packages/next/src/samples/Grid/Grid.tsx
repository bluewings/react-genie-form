import * as React from 'react';
import Form from '../../components/Form';
import styles from './Grid.module.scss';

interface IGridProps {
  /**
   * Prop Description
   */
  message?: string;
}

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
  [
    {
      element: (
        <div style={{ background: 'yellow', textAlign: 'center' }}>
          - divider -
        </div>
      ),
      grid: 3,
    },
    <div style={{ background: 'orange', textAlign: 'center' }}>
      - - - divider - - -
    </div>,
  ],
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

function Grid(props: IGridProps) {
  return (
    <div className={styles.root}>
      {/* <h1>Grid</h1> */}
      <Form schema={schema} form={grid} />
    </div>
  );
}

export default Grid;
