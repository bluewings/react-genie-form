import * as React from 'react';
import Form from '../../components/Form';
import styles from './AnyOf.module.scss';

interface IAnyOfProps {
  /**
   * Prop Description
   */
  message?: string;
}

const schema = {
  type: 'object',
  anyOf: [
    {
      properties: { category: { enum: ['movie', 'game'] } },
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
      'ui:show': '@.title === "wow"',
    },
    releaseDate: {
      type: 'string',
      'ui:show': '@.title === "wow"',
    },
    numOfPlayers: { type: 'number' },
  },
};
/**
 * Component Description
 */
function AnyOf(props: IAnyOfProps) {
  return (
    <div className={styles.root}>
      <h1>AnyOf</h1>
      <Form schema={schema} />
    </div>
  );
}

export default AnyOf;
