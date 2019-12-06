import * as React from 'react';

function TypeDate({ name, defaultValue, onChange }: any) {
  return (
    <input
      type="date"
      name={name}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
}

export default TypeDate;
