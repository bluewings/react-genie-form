import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Form from '../../components/Form';

test('virtual', () => {
  const schema = {
    type: 'object',
    properties: {
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' },
    },
    virtual: {
      period: {
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
          <input
            type="date"
            data-testid="period-start"
            value={value[0]}
            onChange={handleDate1Change}
          />
          ~
          <input
            type="date"
            data-testid="period-end"
            value={value[1]}
            onChange={handleDate2Change}
          />
        </>
      );
    },
  };

  let value = { startDate: '2020-01-01', endDate: '2020-12-31' };
  const { container, getByTestId } = render(
    <Form
      schema={schema}
      formTypeMap={formTypeMap}
      defaultValue={value}
      onChange={(data) => (value = data)}
    />,
  );

  expect(container.querySelectorAll('input').length).toBe(2);
  const periodStart = getByTestId('period-start') as HTMLInputElement;
  const periodEnd = getByTestId('period-end') as HTMLInputElement;
  expect(periodStart.value).toBe('2020-01-01');
  expect(periodEnd.value).toBe('2020-12-31');
  fireEvent.change(periodStart, { target: { value: '2020-05-01' } });
  expect(value).toMatchObject({
    startDate: '2020-05-01',
    endDate: '2020-12-31',
  });
});
